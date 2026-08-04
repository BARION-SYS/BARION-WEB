"use client"

import { useState } from "react"
import { ordenPeriodos, periodos } from "@/config/periodos"
import type { CodigoRegion } from "@/config/regiones"
import { PlanCard } from "@/components/sections/PlanCard"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import type { PeriodoPlan, PlanPublico } from "@/types/landing"
import { cn } from "@/lib/utils"

interface LandingPreciosGridProps {
  planes: PlanPublico[]
  region: CodigoRegion
}

/**
 * Elegir cada cuánto se paga y ver las tarjetas con esa tarifa.
 *
 * Cliente, a diferencia del país: **los tres precios ya vienen en el HTML** —la
 * API los entrega todos y el servidor los renderiza—, así que cambiar de período
 * es elegir cuál se enseña, no volver a pedir nada. El país sí viaja al servidor
 * porque decide qué precios existen; esto no.
 *
 * Arranca en `mensual` a propósito: es la cifra más baja y la que el buscador
 * indexa, porque es la que queda en el HTML de origen.
 */
export function PreciosGrid({ planes, region }: LandingPreciosGridProps) {
  const [periodo, setPeriodo] = useState<PeriodoPlan>("mensual")

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Cada cuánto quieres pagar"
          className="inline-flex rounded-full border border-border bg-card p-1"
        >
          {ordenPeriodos.map((opcion) => {
            const activo = opcion === periodo
            return (
              <button
                key={opcion}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => setPeriodo(opcion)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  activo
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {periodos[opcion].etiqueta}
              </button>
            )
          })}
        </div>
      </div>

      {/* La rejilla se adapta a cuántos planes devuelva la API: con dos, tres
          columnas dejarían un hueco que se lee como un plan que falta */}
      <div
        className={cn(
          "mt-8 grid grid-cols-1 gap-6",
          planes.length >= 3 ? "md:grid-cols-3" : "mx-auto max-w-4xl md:grid-cols-2"
        )}
      >
        {planes.map((plan, indice) => (
          <RevelarEnScroll key={plan.codigo} retardo={indice * 0.08} className="h-full">
            <PlanCard plan={plan} region={region} periodo={periodo} />
          </RevelarEnScroll>
        ))}
      </div>
    </>
  )
}
