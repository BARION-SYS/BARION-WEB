import type { CodigoMoneda, CodigoRegion } from "@/config/regiones"

// Lo que devuelve `GET /publico/planes` — lectura anónima, sin sesión.
// Como todo el dinero del sistema: unidad menor (centavos) + ISO 4217.

export type PeriodoPlan = "mensual" | "anual"

export interface PrecioPublico {
  codigoPais: CodigoRegion
  montoCentavos: number
  moneda: CodigoMoneda
  periodo: PeriodoPlan
}

export interface PlanPublico {
  codigo: string
  nombre: string
  descripcion: string
  /** `null` = sin techo. */
  limites: { sedes: number | null; barberos: number | null }
  funciones: string[]
  destacado: boolean
  precios: PrecioPublico[]
}
