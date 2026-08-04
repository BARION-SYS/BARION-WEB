import type { CodigoRegion } from "@/config/regiones"
import { PreciosGrid } from "@/components/sections/PreciosGrid"
import { RegionSelect } from "@/components/sections/RegionSelect"
import { garantiasPlan } from "@/constants/valor"
import type { PlanPublico } from "@/types/landing"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"

interface LandingPreciosListProps {
  planes: PlanPublico[]
  region: CodigoRegion
}

/**
 * La sección que decide. Se renderiza en servidor con los precios ya resueltos:
 * sin parpadeo de «cargando» y con las cifras en el HTML de origen, que es lo
 * que ve el buscador.
 *
 * Dos elecciones y viajan distinto, a propósito: el **país** vuelve al servidor
 * porque decide qué precios existen, y el **período** se resuelve en el cliente
 * porque los tres ya vinieron en la misma respuesta.
 */
export function PreciosList({ planes, region }: LandingPreciosListProps) {
  return (
    <section
      id="precios"
      className="flex min-h-dvh scroll-mt-20 flex-col justify-center border-b border-border bg-background py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <RevelarEnScroll className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">Precios</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Un precio por barbería, no por cada cosa que uses
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              El precio depende del país donde factures, no del cambio del día. Pagas mes a mes o
              adelantas y pagas menos; cambias de plan cuando el negocio lo pida, y lo que ya está
              agendado no se toca.
            </p>
          </div>
          <RegionSelect region={region} />
        </RevelarEnScroll>

        <PreciosGrid planes={planes} region={region} />

        {/* Lo que trae CUALQUIER plan: es lo que se pregunta justo después de
            mirar los precios, y responderlo aquí evita una tabla comparativa */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm font-medium">Todos los planes incluyen</p>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {garantiasPlan.map(({ icono: Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Icono className="size-4 shrink-0 text-primary" aria-hidden />
                {texto}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            15 días de prueba. Sin tarjeta. Eliges plan al final.
          </p>
        </div>
      </div>
    </section>
  )
}
