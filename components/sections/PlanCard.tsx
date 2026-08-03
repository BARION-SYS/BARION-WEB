import { ArrowRight, Check, MapPin, Users } from "lucide-react"
import type { CodigoRegion } from "@/config/regiones"
import { regiones } from "@/config/regiones"
import type { PlanPublico } from "@/types/landing"
import { textoLimite } from "@/lib/region"
import { rutasApp } from "@/config/rutas"
import { Button } from "@/components/ui/button"
import { formatMoney } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface LandingPlanCardProps {
  plan: PlanPublico
  region: CodigoRegion
}

export function PlanCard({ plan, region }: LandingPlanCardProps) {
  const { locale } = regiones[region]

  // El precio del país que se está mirando, **mensual**. Si el plan solo tiene
  // tarifa anual en esta región no se divide entre doce para inventar una
  // mensual: eso es exactamente la conversión que el sitio no hace. Se dice
  // «Consultar», igual que cuando no hay ninguna tarifa.
  const precio = plan.precios.find((p) => p.codigoPais === region && p.periodo === "mensual")

  // Los topes que el plan DECLARA. Uno ausente no se pinta: ni número inventado
  // ni «sin límite» de regalo.
  const topes = [
    { icono: MapPin, texto: textoLimite(plan.limites.sedes, "sede", "sedes") },
    { icono: Users, texto: textoLimite(plan.limites.barberos, "barbero", "barberos") },
  ].filter((tope): tope is { icono: typeof MapPin; texto: string } => tope.texto !== null)

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-card p-7 transition-[border-color,box-shadow,transform] duration-300 hover:shadow-xl motion-safe:hover:-translate-y-1",
        plan.destacado ? "border-primary shadow-md" : "border-border hover:border-primary/40"
      )}
    >
      {plan.destacado && (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          El más elegido
        </span>
      )}

      <h3 className="text-lg font-semibold tracking-tight">{plan.nombre}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{plan.descripcion}</p>

      <p className="mt-6 flex items-baseline gap-1.5">
        {/* Sin precio para este país NO se calcula uno: se dice. Un `usd × tasa`
            en el cliente es un precio inventado. */}
        {precio ? (
          <>
            {/* La moneda es la DEL PRECIO, no la que este sitio asocia al país:
                el importe y su moneda viajan juntos desde la API y separarlos
                es cómo se acaba pintando un importe en dólares con el formato
                del peso. El `locale` sí es el de quien mira — decide los puntos
                y los decimales, no la escala. */}
            <span className="text-4xl font-bold tracking-tight tabular-nums">
              {formatMoney(precio.montoCentavos, precio.moneda, locale)}
            </span>
            <span className="text-sm text-muted-foreground">/ mes</span>
          </>
        ) : (
          <span className="text-2xl font-bold tracking-tight">Consultar</span>
        )}
      </p>

      {topes.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {topes.map(({ icono: Icono, texto }) => (
            <li key={texto} className="flex items-center gap-1.5">
              <Icono className="size-3.5" aria-hidden />
              {texto}
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.funciones.map((funcion) => (
          <li key={funcion} className="flex gap-2.5 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-muted-foreground">{funcion}</span>
          </li>
        ))}
      </ul>

      <Button
        render={<a href={rutasApp.registro} />}
        nativeButton={false}
        variant={plan.destacado ? "default" : "outline"}
        size="lg"
        className="group/cta mt-7 h-11 w-full font-semibold"
      >
        Empezar con {plan.nombre}
        <ArrowRight
          className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
          aria-hidden
        />
      </Button>
    </div>
  )
}
