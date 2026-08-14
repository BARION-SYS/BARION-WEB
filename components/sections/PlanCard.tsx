import { useTranslations } from "next-intl"
import { esClaveFuncion, esClavePlan } from "@/config/contenido"
import { ArrowRight, Check, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ahorroPorcentual } from "@/config/periodos"
import { regiones, type CodigoRegion } from "@/config/regiones"
import { rutasApp } from "@/config/rutas"
import { formatMoney } from "@/lib/currency"
import { TARJETA_AIRE, TARJETA_VIVA } from "@/lib/superficies"
import { cn } from "@/lib/utils"
import type { PeriodoPlan, PlanPublico } from "@/types/landing"

interface PlanCardProps {
  plan: PlanPublico
  region: CodigoRegion
  periodo: PeriodoPlan
  /**
   * Cuando este plan incluye ENTERO al anterior, en vez de repetir su lista se
   * dice «Todo lo de Esencial, y además:» y se enumeran solo las diferencias.
   *
   * Es una decisión de la tarjeta y no del dato: la API dice qué funciones trae
   * el plan, todas, y así debe ser —un cliente que pregunta «¿el Pro incluye la
   * agenda?» necesita un sí—. Lo que no sirve es una tarjeta con diez viñetas
   * donde cinco son las mismas que la de al lado: al leerlas en paralelo, lo que
   * de verdad se compra desaparece entre lo repetido.
   */
  herencia?: { nombre: string; propias: string[] }
}

export function PlanCard({ plan, region, periodo, herencia }: PlanCardProps) {
  const t = useTranslations("precios")
  const { locale } = regiones[region]

  // El precio del país que se está mirando, en el período elegido. Si el plan no
  // tiene esa tarifa publicada aquí **no se calcula desde otra**: ni dividiendo
  // la anual entre doce ni multiplicando la mensual por seis. Se dice
  // «Consultar», igual que cuando no hay ninguna tarifa.
  const precio = plan.precios.find((p) => p.codigoPais === region && p.periodo === periodo)

  // El mensual solo para comparar. Sin él no se presume ahorro: el porcentaje
  // sale de restar dos importes publicados, nunca de uno supuesto.
  const mensual = plan.precios.find((p) => p.codigoPais === region && p.periodo === "mensual")
  const ahorro = precio
    ? ahorroPorcentual(periodo, precio.montoCentavos, mensual?.montoCentavos ?? null)
    : null

  /**
   * Los topes que el plan DECLARA, y sus tres estados.
   *
   * `undefined` es «el plan no declara ese tope» y no se pinta: ni número
   * inventado ni «sin límite» de regalo. `null` es «sin techo», y va con mensaje
   * propio porque ICU pluraliza cantidades, no ausencias. Un número se pluraliza
   * en el catálogo, que es donde cada idioma decide su forma.
   */
  const tope = (cantidad: number | null | undefined, clave: "limiteSedes" | "limiteBarberos") => {
    if (cantidad === undefined) return null
    return cantidad === null ? t(`${clave}SinTope`) : t(clave, { cantidad })
  }

  const topes = [
    { icono: MapPin, texto: tope(plan.limites.sedes, "limiteSedes") },
    { icono: Users, texto: tope(plan.limites.barberos, "limiteBarberos") },
  ].filter((valor): valor is { icono: typeof MapPin; texto: string } => valor.texto !== null)

  // Un plan que la API publique y este sitio no sepa describir se enseña igual,
  // sin descripción: desaparecer es lo único que el visitante no puede notar.
  const descripcion = esClavePlan(plan.codigo) ? t(`planes.${plan.codigo}.descripcion`) : null
  const funcionesVisibles = herencia ? herencia.propias : plan.funciones

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-card",
        TARJETA_AIRE,
        TARJETA_VIVA,
        // El borde del destacado NO puede salir de `TARJETA`: ese trae
        // `border-border`, y aquí el borde es lo que marca cuál se recomienda.
        plan.destacado && "border-primary shadow-md hover:border-primary"
      )}
    >
      {plan.destacado && (
        <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {t("masElegido")}
        </span>
      )}

      <h3 className="text-lg font-semibold tracking-tight">{plan.nombre}</h3>
      {descripcion && <p className="mt-1.5 text-sm text-muted-foreground">{descripcion}</p>}

      <p className="mt-6 flex items-baseline gap-1.5">
        {/* Sin precio para este país NO se calcula uno: se dice. Un `usd × tasa`
            en el cliente es un precio inventado. */}
        {precio ? (
          <>
            {/* La moneda es la DEL PRECIO, no la que este sitio asocia al país:
                el importe y su moneda viajan juntos desde la API y separarlos es
                cómo se acaba pintando un importe en dólares con el formato del
                peso. El `locale` sí es el de quien mira — decide los puntos y los
                decimales, no la escala. */}
            <span className="text-4xl font-bold tracking-tight tabular-nums">
              {formatMoney(precio.montoCentavos, precio.moneda, locale)}
            </span>
            <span className="text-sm text-muted-foreground">{t(`periodos.${periodo}.sufijo`)}</span>
          </>
        ) : (
          <span className="text-2xl font-bold tracking-tight">{t("consultar")}</span>
        )}
      </p>

      {/* El ahorro se enseña solo cuando existe de verdad. Un hueco fijo con
          «ahorra 0 %» en el mensual sería ruido en la tarjeta que más se mira. */}
      {ahorro !== null && (
        <p className="mt-2 text-sm font-medium text-primary">
          {t("ahorro", { porcentaje: ahorro })}
        </p>
      )}

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

      <div className="mt-6 flex-1">
        {herencia && (
          <p className="mb-3 text-sm font-medium">{t("todoLoDe", { plan: herencia.nombre })}</p>
        )}
        <ul className="space-y-2.5">
          {funcionesVisibles.map((clave) => (
            <li key={clave} className="flex gap-2.5 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {/* Una función que la API publique y este sitio no sepa nombrar se
                  enseña con su clave: desaparecer es lo único que el visitante
                  no puede notar. */}
              <span className="text-muted-foreground">
                {esClaveFuncion(clave) ? t(`funciones.${clave}`) : clave}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        render={<a href={rutasApp.registro} />}
        nativeButton={false}
        variant={plan.destacado ? "default" : "outline"}
        size="lg"
        className="group/cta mt-7 h-11 w-full font-semibold"
      >
        {t("empezarCon", { plan: plan.nombre })}
        <ArrowRight
          className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
          aria-hidden
        />
      </Button>
    </div>
  )
}
