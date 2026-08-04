import type { PeriodoPlan } from "@/types/landing"

/**
 * Cada cuánto se paga, y cómo se dice.
 *
 * Los tres se ofrecen a la vez y elige quien compra: el semestral y el anual
 * existen para que quien pueda adelantar pague menos, no para sustituir al
 * mensual.
 *
 * `meses` NO sirve para calcular precios —el precio de cada período lo publica
 * la API y este sitio jamás lo deriva— sino para dos cosas honestas: escribir el
 * sufijo («/ 6 meses») y calcular **cuánto se ahorra** comparando dos importes
 * que ya existen. Si falta uno de los dos, no hay ahorro que enseñar.
 */
export const periodos: Record<PeriodoPlan, { etiqueta: string; sufijo: string; meses: number }> = {
  mensual: { etiqueta: "Mensual", sufijo: "/ mes", meses: 1 },
  semestral: { etiqueta: "Semestral", sufijo: "/ 6 meses", meses: 6 },
  anual: { etiqueta: "Anual", sufijo: "/ año", meses: 12 },
}

/** El orden en que se ofrecen: de menos a más compromiso. */
export const ordenPeriodos: readonly PeriodoPlan[] = ["mensual", "semestral", "anual"]

/**
 * Cuánto se ahorra frente a pagar mes a mes, en porcentaje entero.
 *
 * Se calcula sobre los DOS importes publicados, nunca sobre uno inventado:
 * `null` cuando falta cualquiera de los dos, cuando el período es el mensual, o
 * cuando no hay ahorro que presumir. Un «ahorra 0 %» es peor que no decir nada.
 *
 * Se redondea hacia abajo a propósito: prometer un 10 % y que la resta dé 9,7
 * es una promesa que el importe desmiente.
 */
export function ahorroPorcentual(
  periodo: PeriodoPlan,
  centavosDelPeriodo: number,
  centavosMensuales: number | null
): number | null {
  if (periodo === "mensual" || centavosMensuales === null) return null

  const sinDescuento = centavosMensuales * periodos[periodo].meses
  if (sinDescuento <= 0) return null

  const ahorro = Math.floor(((sinDescuento - centavosDelPeriodo) / sinDescuento) * 100)
  return ahorro > 0 ? ahorro : null
}
