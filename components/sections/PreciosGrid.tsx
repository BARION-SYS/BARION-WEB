"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import { PlanCard } from "@/components/sections/PlanCard"
import { ordenPeriodos } from "@/config/periodos"
import type { CodigoRegion } from "@/config/regiones"
import { cn } from "@/lib/utils"
import type { PeriodoPlan, PlanPublico } from "@/types/landing"

interface PreciosGridProps {
  planes: PlanPublico[]
  region: CodigoRegion
}

/**
 * Qué plan incluye entero al anterior.
 *
 * Se calcula, no se declara: la API dice qué trae cada plan y esto solo mira si
 * uno contiene al otro. Declararlo a mano en el diccionario sería una segunda
 * verdad que se desincroniza la primera vez que un plan cambie de funciones —y
 * entonces la tarjeta prometería «todo lo de Esencial» sin que sea cierto.
 */
function herenciaDe(plan: PlanPublico, anterior: PlanPublico | undefined) {
  if (!anterior) return undefined

  const propias = plan.funciones.filter((clave) => !anterior.funciones.includes(clave))
  const contieneTodo = propias.length < plan.funciones.length
  // Solo se agrupa si de verdad hereda TODO lo del anterior y además aporta algo:
  // sin lo primero la frase mentiría, y sin lo segundo la tarjeta quedaría con un
  // encabezado y ninguna viñeta debajo.
  const heredaEntero = anterior.funciones.every((clave) => plan.funciones.includes(clave))

  return heredaEntero && contieneTodo && propias.length > 0
    ? { nombre: anterior.nombre, propias }
    : undefined
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
export function PreciosGrid({ planes, region }: PreciosGridProps) {
  const t = useTranslations("precios")
  const [periodo, setPeriodo] = useState<PeriodoPlan>("mensual")

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div
          role="radiogroup"
          aria-label={t("cadaCuanto")}
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
                  "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activo
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(`periodos.${opcion}.etiqueta`)}
              </button>
            )
          })}
        </div>
      </div>

      {/* La rejilla se adapta a cuántos planes devuelva la API: con dos, tres
          columnas dejarían un hueco que se lee como un plan que falta */}
      <div
        className={cn(
          "mt-10 grid grid-cols-1 gap-6",
          planes.length >= 3 ? "md:grid-cols-3" : "mx-auto max-w-4xl md:grid-cols-2"
        )}
      >
        {planes.map((plan, indice) => (
          <RevelarEnScroll key={plan.codigo} retardo={indice * 0.08} className="h-full">
            <PlanCard
              plan={plan}
              region={region}
              periodo={periodo}
              herencia={herenciaDe(plan, planes[indice - 1])}
            />
          </RevelarEnScroll>
        ))}
      </div>
    </>
  )
}
