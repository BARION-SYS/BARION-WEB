"use client"

import { Globe } from "lucide-react"
import { regiones, type CodigoRegion } from "@/config/regiones"
import { useRegion } from "@/hooks/useRegion"
import { nombresDeRegion } from "@/lib/region"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LandingRegionSelectProps {
  region: CodigoRegion
  /**
   * Los países donde Barion opera HOY, según la API.
   *
   * Se recibe por props y no se lee de `config/regiones.ts` porque esa constante
   * dice qué monedas sabe pintar este sitio, no dónde se puede comprar. Ofrecer
   * un país cerrado manda a alguien a rellenar el formulario de alta entero para
   * recibir un 422 al final, que es el peor sitio para enterarse.
   */
  operados: CodigoRegion[]
}

/**
 * Corrige el país que el servidor dedujo de `Accept-Language`.
 *
 * Solo la vista: qué significa elegir un país —dónde se guarda y quién vuelve a
 * pintar— es de `useRegion`. Va JUNTO a los precios, no en el pie: detectar mal
 * y no poder corregirlo es peor que preguntar.
 */
export function RegionSelect({ region, operados }: LandingRegionSelectProps) {
  const { elegirRegion, cambiando } = useRegion()

  const alCambiar = (valor: CodigoRegion | null) => {
    if (valor) elegirRegion(valor)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="size-4 text-muted-foreground" aria-hidden />
      <label htmlFor="region-precios" className="text-sm text-muted-foreground">
        Ver precios en
      </label>
      {/* Mientras el servidor repinta, el control no acepta otra elección: dos
          cambios seguidos dejarían la cookie y lo pintado en desacuerdo */}
      <Select value={region} onValueChange={alCambiar} disabled={cambiando}>
        <SelectTrigger id="region-precios" className="h-10" aria-busy={cambiando}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operados.map((codigo) => (
            <SelectItem key={codigo} value={codigo}>
              {nombresDeRegion[codigo]} ({regiones[codigo].moneda})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
