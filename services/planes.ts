import "server-only"
import { z } from "zod"
import { monedas, regiones, type CodigoMoneda, type CodigoRegion } from "@/config/regiones"
import { PLAN_DESTACADO } from "@/config/contenido"
import planesRespaldo from "@/constants/planes.fallback.json"
import { ErrorApi, leerJson } from "@/lib/api/cliente"
import { endpointsApi } from "@/lib/api/endpoints"
import type { LimitesPlan, PeriodoPlan, PlanPublico, PrecioPublico } from "@/types/landing"

/**
 * Los planes y sus precios: el dato que decide la venta.
 *
 * Un servicio, no un `fetch` dentro de la página. Lo que hay entre la API y el
 * componente no es «una petición»: es una política de caché, una validación de
 * lo que llegó y una decisión de qué enseñar cuando no llega nada. Tres cosas
 * que la página no tiene por qué saber, y que si viven en ella se copian el día
 * que un segundo sitio necesite lo mismo.
 */

const PERIODOS = ["mensual", "semestral", "anual"] as const

/** Marca de todas las líneas de este servicio: `grep "\[planes\]"` y ya está. */
const ETIQUETA = "[planes]"

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

/**
 * El precio TAL COMO lo declara la API: `codigoPais`, `moneda` y `periodo` son
 * cadenas libres allá, no enumerados.
 *
 * Y por eso aquí tampoco son un `z.enum`. Barion factura hoy en tres países,
 * pero `precios_plan.codigo_pais` es un `char(2)` sin lista cerrada: el día que
 * alguien dé de alta México, un enum haría reventar la validación **de toda la
 * respuesta** y la página entera caería al respaldo —precios congelados de los
 * tres países— por un cuarto precio que este sitio ni siquiera enseña.
 *
 * Lo que se comprueba aquí es la FORMA (que el importe sea dígitos, que los
 * campos existan). Que el valor sea de una región conocida se decide después,
 * precio a precio, en `precioConocido()`: un país que el sitio no vende descarta
 * ESE precio, nunca la lista.
 */
const esquemaPrecioApi = z.object({
  codigoPais: z.string(),
  montoCentavos: centavos,
  moneda: z.string(),
  periodo: z.string(),
})

type PrecioApi = z.infer<typeof esquemaPrecioApi>

/**
 * Lo que la API publica en `GET /publico/planes`: **datos del plan, sin copy**.
 *
 * `funciones` son las CLAVES incluidas (`["agenda","portal"]`), no frases: en la
 * base son banderas de producto y el texto de venta vive en
 * `constants/planes.copy.ts`. Ver ahí el porqué.
 *
 * `limites` es el `jsonb` crudo —claves libres, valores cualesquiera—, así que
 * se declara `unknown` **y opcional**, y lo normaliza `topesDe()`. Exigir aquí
 * `sedes` y `barberos` sería exigirle una forma a una columna que no la tiene:
 * el día que un plan se guarde solo con `sedes`, la tabla de precios entera se
 * iría al respaldo por una viñeta. (`z.unknown()` a secas no vale: en zod 4 la
 * clave sigue siendo obligatoria y ausente ≠ `unknown`.)
 *
 * `precios` puede venir VACÍO: solo viajan los activos, y retirar todas las
 * tarifas de un plan es una decisión legítima. La tarjeta dirá «Consultar».
 */
const esquemaPlanApi = z.object({
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  limites: z.unknown().optional(),
  funciones: z.array(z.string()),
  precios: z.array(esquemaPrecioApi),
})

type PlanApi = z.infer<typeof esquemaPlanApi>

/**
 * La envoltura de la API: `{ data, message, status, pagination }`. Aquí solo
 * interesa `data` — los demás campos se ignoran, no se copian.
 *
 * **Sin `.min(1)`**: `data: []` es una respuesta VÁLIDA (ningún plan activo) y
 * tratarla como contrato roto confundiría dos causas distintas en el log. Se
 * detecta aparte, y se avisa con sus palabras.
 */
const esquemaRespuesta = z.object({ data: z.array(esquemaPlanApi) })

/**
 * El respaldo del repositorio: la página entera congelada, con su copy.
 *
 * Se valida MÁS ESTRICTO que la API a propósito. Lo de allá es dato ajeno que
 * puede crecer sin avisar; esto es una constante que edita una persona de este
 * equipo, así que un país que el sitio no conoce o un periodo mal escrito son un
 * error del repositorio y tienen que reventar **al arrancar** — no seis meses
 * después, el día que la API se caiga y sea justo lo que se sirve.
 *
 * Su `montoCentavos` va como NÚMERO y el de la API como cadena, y no es una
 * incoherencia: son fuentes distintas. La cadena existe porque el importe viaja
 * en JSON desde un `bigint`; este archivo no viaja por ningún sitio. Obligar a
 * escribir `"8900000"` entre comillas sería imitar una limitación de transporte
 * que aquí no existe.
 */
const esquemaPlanCompleto = esquemaPlanApi.extend({
  limites: z.object({
    sedes: z.number().int().positive().nullable(),
    barberos: z.number().int().positive().nullable(),
  }),
  precios: z
    .array(
      z.object({
        codigoPais: z.enum(Object.keys(regiones) as [CodigoRegion, ...CodigoRegion[]]),
        montoCentavos: z.number().int().nonnegative(),
        moneda: z.enum(monedas as [CodigoMoneda, ...CodigoMoneda[]]),
        periodo: z.enum(PERIODOS),
      })
    )
    .min(1),
})

/**
 * Un respaldo vacío no es un respaldo: si esto se queda sin planes, que falle.
 *
 * Pasa por `publicar()` igual que lo que llega de la API, y por eso el archivo
 * tiene su MISMA forma —claves de función, sin copy—: el respaldo imita a la
 * fuente, no al componente. Cuando imitaba al componente había que acordarse de
 * traducirlo a mano, y ese es justo el archivo que nadie vuelve a abrir.
 */
const respaldo: PlanPublico[] = z
  .array(esquemaPlanCompleto)
  .min(1)
  .parse(planesRespaldo)
  .map((plan) => publicar(plan, []))

/** Un precio cambia como mucho una vez al mes. */
const CACHE_SEGUNDOS = 3600

export async function obtenerPlanesPublicos(): Promise<PlanPublico[]> {
  let crudos: PlanApi[]

  try {
    const cuerpo = await leerJson(endpointsApi.planesPublicos, { revalidate: CACHE_SEGUNDOS })
    crudos = esquemaRespuesta.parse(cuerpo).data
  } catch (causa) {
    return conRespaldo(describir(causa))
  }

  // 200 con la lista vacía es una respuesta legítima —ningún plan activo—, pero
  // una tabla de precios sin precios no vende nada: se sirve el respaldo. Es la
  // única forma de que el sitio no se quede mudo mientras alguien lo arregla.
  if (crudos.length === 0) {
    return conRespaldo("la API respondió 200 pero sin ningún plan activo (`data: []`)")
  }

  const descartados: string[] = []
  const planes = crudos.map((plan) => publicar(plan, descartados))

  // Descartar un precio NO es servir el respaldo: la página sigue enseñando
  // datos de la API. Se avisa igual, porque un precio que el sitio tira en
  // silencio es un país que alguien dio de alta y aquí nunca aparece.
  if (descartados.length > 0) {
    console.warn(
      `${ETIQUETA} precios ignorados por no ser de una región que este sitio vende: ${descartados.join(", ")}`
    )
  }

  const sinPrecio = planes.filter((plan) => plan.precios.length === 0).map((plan) => plan.codigo)
  if (sinPrecio.length > 0) {
    console.warn(
      `${ETIQUETA} planes sin precio publicable, se enseñan como «Consultar»: ${sinPrecio.join(", ")}`
    )
  }

  // La línea que dice que lo que se está viendo es REAL. Sin ella, «no hay
  // avisos» se confunde con «la ruta ni siquiera se ejecutó, salió de caché».
  console.info(
    `${ETIQUETA} datos de la API — ${planes.length} planes (GET ${endpointsApi.planesPublicos})`
  )

  return planes
}

/**
 * El respaldo tiene la MISMA forma que lo que sale de `publicar`, así que la
 * página no distingue de dónde vino el dato — solo el log lo sabe.
 *
 * Ese aviso no es adorno: sin él, una API caída se ve exactamente igual que una
 * API sana con los mismos precios, y nadie se entera de que la página lleva un
 * mes enseñando datos congelados. Y **no** se pinta nada al visitante: quien
 * mira precios no tiene por qué leer que el proveedor tiene un problema.
 */
function conRespaldo(causa: string): PlanPublico[] {
  console.warn(`${ETIQUETA} RESPALDO del repositorio (precios congelados) — ${causa}`)
  return respaldo
}

/**
 * Lo que la API dice de un plan, quedándose solo con lo que este sitio sabe
 * pintar.
 *
 * **Aquí no entra copy**, y esa es la frontera: el texto de venta tiene idioma
 * y esta respuesta se cachea una vez para los dos. Lo único que se decide en
 * este punto es cuál se destaca, que es una decisión de la página.
 */
function publicar(plan: PlanApi, descartados: string[]): PlanPublico {
  const precios: PrecioPublico[] = []
  for (const crudo of plan.precios) {
    const precio = precioConocido(crudo)
    if (precio) precios.push(precio)
    else descartados.push(`${plan.codigo}/${crudo.codigoPais}-${crudo.moneda}-${crudo.periodo}`)
  }

  return {
    codigo: plan.codigo,
    nombre: plan.nombre,
    // Cuál se resalta lo decide ESTE sitio, no la API: es una decisión de venta
    // —y de una sola página—, no un atributo del plan. Guardarla en la base
    // obligaría a un despliegue para cambiar de opinión.
    destacado: plan.codigo === PLAN_DESTACADO,
    limites: topesDe(plan.limites),
    // Las CLAVES, tal como vienen. Traducirlas aquí ataría a un idioma un dato
    // que se cachea una vez para los dos.
    funciones: plan.funciones,
    precios,
  }
}

/**
 * El precio, si este sitio sabe enseñarlo. `null` si no.
 *
 * Tres razones para descartarlo, y ninguna es un fallo de la API:
 *
 *  · **el país no es de los que este sitio vende** — no hay bandera, ni nombre,
 *    ni entrada en el selector; enseñarlo sería una fila sin país;
 *  · **la moneda no está en `escalaPorMoneda`** — sin escala no hay división
 *    posible y `formatMoney` pintaría «NaN» en el sitio del precio;
 *  · **el periodo no es uno de los tres publicados** — hoy lo garantiza un CHECK
 *    en la base, pero el contrato lo declara como cadena y un periodo nuevo no puede
 *    tumbar la tabla entera.
 *
 * `trim` y mayúsculas porque `codigo_pais` es `char(2)` y `moneda` es `char(3)`:
 * el tipo de Postgres rellena con espacios, y `"CO "` no es `"CO"`.
 */
function precioConocido(crudo: PrecioApi): PrecioPublico | null {
  const codigoPais = crudo.codigoPais.trim().toUpperCase()
  const moneda = crudo.moneda.trim().toUpperCase()
  const periodo = crudo.periodo.trim().toLowerCase()

  if (!esRegion(codigoPais) || !esMoneda(moneda) || !esPeriodo(periodo)) return null

  return { codigoPais, montoCentavos: crudo.montoCentavos, moneda, periodo }
}

function esRegion(valor: string): valor is CodigoRegion {
  return valor in regiones
}

function esMoneda(valor: string): valor is CodigoMoneda {
  return (monedas as readonly string[]).includes(valor)
}

function esPeriodo(valor: string): valor is PeriodoPlan {
  return (PERIODOS as readonly string[]).includes(valor)
}

/**
 * El `jsonb` de topes, leído sin fiarse.
 *
 * Solo se aceptan enteros positivos y `null`; cualquier otra cosa —una cadena,
 * un cero, una clave que no está— deja el tope AUSENTE, y ausente significa
 * «este plan no lo declara», no «ilimitado». La diferencia importa: `null` se
 * pinta como «sin límite», y llegar a eso por una clave que falta sería
 * prometer en la página algo que nadie decidió.
 */
function topesDe(valor: unknown): LimitesPlan {
  const crudo =
    typeof valor === "object" && valor !== null && !Array.isArray(valor)
      ? (valor as Record<string, unknown>)
      : {}

  return { sedes: tope(crudo.sedes), barberos: tope(crudo.barberos) }
}

function tope(valor: unknown): number | null | undefined {
  if (valor === null) return null
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0 ? valor : undefined
}

/**
 * Por qué se sirve el respaldo, dicho con la precisión que hace falta para
 * arreglarlo: no es lo mismo que nadie conteste, que conteste con un 503 o que
 * conteste algo que no es el contrato.
 */
function describir(causa: unknown): string {
  if (causa instanceof ErrorApi) {
    const detalle = causa.sinRespuesta ? "SIN RESPUESTA" : `ESTADO HTTP ${causa.estado}`
    return `${detalle}: ${causa.message} (GET ${causa.ruta})`
  }

  if (causa instanceof z.ZodError) {
    const fallos = causa.issues
      .map((problema) => `${problema.path.join(".") || "(raíz)"}: ${problema.message}`)
      .join(" · ")
    return `FUERA DE CONTRATO en ${endpointsApi.planesPublicos} — ${fallos}`
  }

  return causa instanceof Error ? causa.message : String(causa)
}
