import type { CodigoMoneda, CodigoRegion } from "@/config/regiones"

// Lo que devuelve `GET /publico/planes` — lectura anónima, sin sesión.
// Como todo el dinero del sistema: unidad menor (centavos) + ISO 4217.

export type PeriodoPlan = "mensual" | "semestral" | "anual"

export interface PrecioPublico {
  codigoPais: CodigoRegion
  montoCentavos: number
  moneda: CodigoMoneda
  periodo: PeriodoPlan
}

/**
 * Los techos de uso del plan. En la base son un `jsonb` de claves libres, así
 * que aquí hay TRES estados y no dos:
 *
 * - un número → ese es el tope;
 * - `null` → **sin techo**, y así lo dice la tarjeta («sedes sin límite»);
 * - **ausente** → el plan no declara ese techo. No es lo mismo que ilimitado:
 *   prometer «sin límite» porque falta una clave del jsonb es vender algo que
 *   nadie ha decidido. Cuando falta, la tarjeta no dice nada de ese tope.
 */
export interface LimitesPlan {
  sedes?: number | null
  barberos?: number | null
}

export interface PlanPublico {
  codigo: string
  nombre: string
  descripcion: string
  limites: LimitesPlan
  funciones: string[]
  destacado: boolean
  /**
   * Puede venir **vacío**: la API publica solo los precios activos, y un plan
   * sin ninguno —o con precios de países donde este sitio no vende— se enseña
   * con «Consultar». Inventar una conversión sería peor que no dar cifra.
   */
  precios: PrecioPublico[]
}
