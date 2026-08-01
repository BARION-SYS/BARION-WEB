import "server-only"
import { z } from "zod"
import { monedas, regiones, type CodigoMoneda, type CodigoRegion } from "@/config/regiones"
import { copyDe, fraseDeFuncion } from "@/constants/planes.copy"
import planesRespaldo from "@/constants/planes.fallback.json"
import { ErrorApi, leerJson } from "@/lib/api/cliente"
import { endpointsApi } from "@/lib/api/endpoints"
import type { PlanPublico } from "@/types/landing"

/**
 * Los planes y sus precios: el dato que decide la venta.
 *
 * Un servicio, no un `fetch` dentro de la página. Lo que hay entre la API y el
 * componente no es «una petición»: es una política de caché, una validación de
 * lo que llegó y una decisión de qué enseñar cuando no llega nada. Tres cosas
 * que la página no tiene por qué saber, y que si viven en ella se copian el día
 * que un segundo sitio necesite lo mismo.
 */

const codigosRegion = Object.keys(regiones) as [CodigoRegion, ...CodigoRegion[]]
const codigosMoneda = monedas as [CodigoMoneda, ...CodigoMoneda[]]

/**
 * La forma que promete el contrato, comprobada de verdad.
 *
 * Validar y no castear: un `as PlanPublico[]` no comprueba nada, así que una
 * API que cambie `moneda` por `divisa` pasaría el casteo y reventaría al
 * formatear, dentro del componente y en producción. Aquí revienta en la
 * frontera, que es donde se puede responder con el respaldo.
 *
 * `satisfies` amarra el esquema al tipo de `types/landing.ts`: si el contrato
 * cambia en un sitio y no en el otro, no compila.
 */

/**
 * El dinero llega como CADENA, no como número.
 *
 * Es la convención de toda la API de Barion —unidad menor en `bigint`, que en
 * JSON no cabe— y aquí se convierte una sola vez, en la frontera. Aceptarlo como
 * número habría sido pedirle a la API que hiciera una excepción para esta
 * página; la excepción es la que luego nadie recuerda.
 *
 * `regex` antes de convertir: `Number("12abc")` da `NaN` y un `NaN` en un precio
 * se pinta como «$ NaN» en producción.
 */
const centavos = z
  .string()
  .regex(/^\d+$/, "los centavos vienen como dígitos, sin signo ni decimales")
  .transform(Number)

const esquemaPrecio = z.object({
  codigoPais: z.enum(codigosRegion),
  montoCentavos: centavos,
  moneda: z.enum(codigosMoneda),
  periodo: z.enum(["mensual", "anual"]),
})

/**
 * Lo que la API publica en `GET /publico/planes`: **datos del plan, sin copy**.
 *
 * `funciones` son las CLAVES incluidas (`["agenda","portal"]`), no frases: en la
 * base son banderas de producto y el texto de venta vive en
 * `constants/planes.copy.ts`. Ver ahí el porqué.
 */
const esquemaPlanApi = z.object({
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  /** `null` = sin techo. */
  limites: z.object({
    sedes: z.number().int().positive().nullable(),
    barberos: z.number().int().positive().nullable(),
  }),
  funciones: z.array(z.string()),
  // Un plan sin precios no se puede enseñar: es un plan roto, no uno gratis.
  precios: z.array(esquemaPrecio).min(1),
})

/**
 * El respaldo del repositorio: la página entera congelada, con su copy.
 *
 * Su `montoCentavos` va como NÚMERO y el de la API como cadena, y no es una
 * incoherencia: son fuentes distintas. La cadena existe porque el importe viaja
 * en JSON desde un `bigint`; este archivo no viaja por ningún sitio y lo edita
 * una persona cuando cambian los precios. Obligarla a escribir `"8900000"` entre
 * comillas sería imitar una limitación de transporte que aquí no existe.
 */
const esquemaPlanCompleto = esquemaPlanApi.extend({
  descripcion: z.string(),
  destacado: z.boolean(),
  precios: z.array(esquemaPrecio.extend({ montoCentavos: z.number().int().nonnegative() })).min(1),
}) satisfies z.ZodType<PlanPublico>

const esquemaRespuesta = z.object({ data: z.array(esquemaPlanApi).min(1) })

/**
 * El respaldo se valida al arrancar, no al usarse.
 *
 * Es una constante del repositorio, así que si se desvía del contrato el fallo
 * es del código y tiene que verse al primer arranque — no seis meses después,
 * el día que la API se caiga y sea justo lo que se sirve.
 */
const respaldo: PlanPublico[] = z.array(esquemaPlanCompleto).parse(planesRespaldo)

/** Un precio cambia como mucho una vez al mes. */
const CACHE_SEGUNDOS = 3600

export async function obtenerPlanesPublicos(): Promise<PlanPublico[]> {
  try {
    const cuerpo = await leerJson(endpointsApi.planesPublicos, { revalidate: CACHE_SEGUNDOS })
    return esquemaRespuesta.parse(cuerpo).data.map(conCopy)
  } catch (causa) {
    // El respaldo tiene la MISMA forma que lo que sale de `conCopy`, así que la
    // página no distingue de dónde vino el dato — solo el log lo sabe.
    //
    // Ese aviso no es adorno: sin él, una API caída se ve exactamente igual que
    // una API sana con los mismos precios, y nadie se entera de que la página
    // lleva un mes enseñando datos congelados.
    console.warn(`[planes] sirviendo el respaldo — ${describir(causa)}`)
    return respaldo
  }
}

/**
 * Dato de la API + copy de este repositorio, cruzados por `codigo`.
 *
 * La frontera está aquí a propósito: **a partir de este punto la página no sabe
 * qué parte vino de dónde**, así que el día que la descripción se administre
 * desde el panel de planes, solo cambia esta función.
 */
function conCopy(plan: z.infer<typeof esquemaPlanApi>): PlanPublico {
  const { descripcion, destacado } = copyDe(plan.codigo)

  return {
    ...plan,
    descripcion,
    destacado,
    // Las claves que la API dice que el plan incluye, dichas para quien compra.
    funciones: plan.funciones.map(fraseDeFuncion),
  }
}

function describir(causa: unknown): string {
  if (causa instanceof ErrorApi) return causa.message
  if (causa instanceof z.ZodError) return `la API devolvió algo fuera de contrato: ${causa.message}`
  return causa instanceof Error ? causa.message : String(causa)
}
