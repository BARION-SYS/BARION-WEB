// Regiones donde opera Barion. Agregar un país = agregar una entrada aquí.
// La config real de cada tenant llega de la API; esto define los valores por región.

export type CodigoRegion = "CO" | "US" | "ES"
export type CodigoMoneda = "COP" | "USD" | "EUR"

export interface ConfigRegional {
  moneda: CodigoMoneda
  locale: string
  timezone: string
}

export const regiones: Record<CodigoRegion, ConfigRegional> = {
  CO: { moneda: "COP", locale: "es-CO", timezone: "America/Bogota" },
  US: { moneda: "USD", locale: "en-US", timezone: "America/New_York" },
  ES: { moneda: "EUR", locale: "es-ES", timezone: "Europe/Madrid" },
}

// Región base del producto (Colombia).
export const REGION_DEFAULT: CodigoRegion = "CO"

/**
 * Las monedas que Barion maneja hoy, derivadas de las regiones: agregar un país
 * arriba las actualiza solas. Sirven para que una sede se elija de una lista en
 * vez de teclear tres letras — la API acepta cualquier trío y `MXN` guardado por
 * error no falla hasta que alguien mira un precio.
 */
export const monedas: CodigoMoneda[] = [
  ...new Set(Object.values(regiones).map((region) => region.moneda)),
]

/**
 * Los códigos que este repositorio sabe FORMATEAR. No es lo mismo que dónde
 * opera Barion —eso lo dice la API— y por eso son dos listas: esta cambia
 * cuando se añade soporte de moneda y locale, aquella cuando se abre un mercado.
 */
export const REGIONES_CONOCIDAS = Object.keys(regiones) as CodigoRegion[]

/** Descarta un país que la API opere y este sitio todavía no sepa pintar. */
export function esRegionConocida(codigo: string): codigo is CodigoRegion {
  return codigo in regiones
}
