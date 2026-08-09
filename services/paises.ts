import "server-only"
import { z } from "zod"
import { ErrorApi, leerJson } from "@/lib/api/cliente"
import { endpointsApi } from "@/lib/api/endpoints"

/**
 * Dónde opera Barion HOY, según la api.
 *
 * ── Por qué esto no sale de una constante del repositorio ───────────────────
 * Porque hasta ahora salía de dos: este sitio declaraba su lista de países y la
 * aplicación la suya, y **las dos se creían la verdad**. El resultado es el que
 * ya se vio: la landing ofrecía precios de un mercado donde el alta responde
 * 422, y el rechazo llegaba **después** de rellenar el formulario entero.
 *
 * Quien decide es `paises.activo` en la base. Abrir un mercado deja de ser dos
 * despliegues coordinados y pasa a ser un `UPDATE`.
 *
 * `config/regiones.ts` NO desaparece y no es contradictorio: allí vive cómo se
 * FORMATEA cada región —moneda, locale, huso— que es un asunto del cliente y no
 * cambia con el negocio. Lo que pasa a decidir la api es **cuáles se ofrecen**.
 */

const ETIQUETA = "[paises]"

const esquemaPais = z.object({
  codigo: z.string().length(2),
  nombre: z.string(),
  moneda: z.string(),
  locale: z.string(),
  zonaHoraria: z.string(),
  prefijoTelefono: z.string(),
})

const esquemaRespuesta = z.object({ data: z.array(esquemaPais) })

export type PaisOperado = z.infer<typeof esquemaPais>

/**
 * Los países abiertos, o `null` si la api no contesta.
 *
 * **`null` no es una lista vacía**, y por eso se distingue: vacía significaría
 * «Barion no opera en ningún sitio» y esconde la tabla de precios entera. Sin
 * respuesta, quien llama decide — y lo que hace es no filtrar, que enseña de más
 * antes que enseñar de menos.
 *
 * Se cachea una hora, como los planes: abrir un mercado ocurre como mucho una
 * vez al trimestre y mil visitas no tienen por qué ser mil peticiones.
 */
export async function obtenerPaisesOperados(): Promise<PaisOperado[] | null> {
  try {
    const json = await leerJson(endpointsApi.paisesPublicos, { revalidate: 3600 })
    const { data } = esquemaRespuesta.parse(json)

    if (data.length === 0) {
      // La api contestó y dice que no hay ninguno. Es un dato raro pero legítimo
      // —todos cerrados— y se avisa, porque significa que nadie puede
      // registrarse y eso no debería pasar sin que alguien lo sepa.
      console.warn(`${ETIQUETA} la api no reporta ningún país abierto`)
      return data
    }

    console.info(`${ETIQUETA} datos de la API — ${data.length} países`)
    return data
  } catch (error) {
    const motivo = error instanceof ErrorApi ? `ESTADO HTTP ${error.estado}` : "FUERA DE CONTRATO"
    console.warn(`${ETIQUETA} SIN LISTA — ${motivo}: no se filtra por país`)
    return null
  }
}
