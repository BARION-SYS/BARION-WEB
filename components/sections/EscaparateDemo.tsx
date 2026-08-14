"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Banknote, Check, Clock, CreditCard, MapPin, Scissors, Smartphone } from "lucide-react"
import { regiones, type CodigoMoneda, type CodigoRegion } from "@/config/regiones"
import { InitialsAvatar } from "@/components/common/InitialsAvatar"
import { formatMoney } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface LandingEscaparateDemoProps {
  region: CodigoRegion
}

/** Las claves del catálogo de mentira. El texto vive en `messages/*.json`. */
type ClaveServicioDemo = "clasico" | "corteBarba" | "navaja"
type ClavePagoDemo = "efectivo" | "tarjeta" | "transferencia"

// Precios declarados POR MONEDA, nunca convertidos: un `usd × tasa` en el
// cliente es un precio inventado, y en una demo se leería igual de real.
//
// En unidad menor, como TODO el dinero del sistema: 3_500_000 son $ 35.000, no
// tres millones y medio. El peso no se escapa de la regla por enseñarse sin
// decimales — ver la tabla de escalas de `lib/currency.ts`.
// El NOMBRE no está aquí: es una clave del diccionario. Lo que se lee en la
// maqueta se traduce como cualquier otro texto del sitio — un escaparate en
// español dentro de la versión inglesa dice, sin querer, que el producto no
// está en inglés.
const servicios = [
  {
    id: "clasico" as ClaveServicioDemo,
    minutos: 40,
    precio: { COP: 3_500_000, USD: 2_500, EUR: 2_200 } as Record<CodigoMoneda, number>,
  },
  {
    id: "corteBarba" as ClaveServicioDemo,
    minutos: 60,
    precio: { COP: 5_200_000, USD: 3_800, EUR: 3_400 } as Record<CodigoMoneda, number>,
  },
  {
    id: "navaja" as ClaveServicioDemo,
    minutos: 30,
    precio: { COP: 2_800_000, USD: 2_000, EUR: 1_800 } as Record<CodigoMoneda, number>,
  },
]

// Los NOMBRES de persona sí son literales: un nombre propio no se traduce.
// Lo que sí se traduce es la especialidad, que es una descripción.
const barberos = [
  { id: "cualquiera", nombre: null, iniciales: "" },
  { id: "ivan", nombre: "Iván Duarte", iniciales: "ID" },
  { id: "duvan", nombre: "Duván Ríos", iniciales: "DR" },
]

const horas = [
  { hora: "09:00", libre: false },
  { hora: "10:30", libre: true },
  { hora: "11:15", libre: true },
  { hora: "12:00", libre: false },
  { hora: "15:30", libre: true },
  { hora: "17:00", libre: true },
]

/**
 * Barion NO cobra al cliente final: solo REGISTRA con qué va a pagar, para que
 * la barbería cuadre su caja. Por eso aquí se elige método y no hay pasarela,
 * ni importe retenido, ni nada que se parezca a un cobro.
 */
const metodosPago = [
  { id: "efectivo" as ClavePagoDemo, icono: Banknote },
  { id: "tarjeta" as ClavePagoDemo, icono: CreditCard },
  { id: "transferencia" as ClavePagoDemo, icono: Smartphone },
]

/**
 * El escaparate, tal y como lo usa el cliente de la barbería: elige servicio,
 * barbero, hora y con qué paga. Es la maqueta que MÁS vende de la página —el
 * dueño se está imaginando a su cliente aquí— y una maqueta que no responde al
 * dedo no cuenta esa historia.
 */
export function EscaparateDemo({ region }: LandingEscaparateDemoProps) {
  const t = useTranslations("maquetas")
  const escaparate = useTranslations("maquetas.escaparate")
  const servicio_ = useTranslations("maquetas.servicios")
  const { moneda, locale } = regiones[region]
  const [servicioId, setServicioId] = useState(servicios[0].id)
  const [barberoId, setBarberoId] = useState(barberos[1].id)
  const [hora, setHora] = useState("10:30")
  const [metodo, setMetodo] = useState(metodosPago[0].id)

  const servicio = servicios.find((s) => s.id === servicioId) ?? servicios[0]
  const barbero = barberos.find((b) => b.id === barberoId) ?? barberos[0]

  const nombreBarbero = (nombre: string | null) => nombre ?? escaparate("cualquiera")
  const especialidad = (id: string) =>
    id === "cualquiera"
      ? escaparate("elPrimeroLibre")
      : id === "ivan"
        ? escaparate("especialidadFades")
        : escaparate("especialidadClasico")

  return (
    <div className="mx-auto w-full max-w-[20rem] overflow-hidden rounded-[2rem] border-4 border-border bg-card shadow-lg">
      <div className="flex justify-center bg-secondary py-2" aria-hidden>
        <span className="h-1.5 w-16 rounded-full bg-border" />
      </div>

      <div className="scroll-fino max-h-[32rem] overflow-y-auto p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Scissors className="size-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{escaparate("barberia")}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" aria-hidden />
              Medellín · Laureles
            </span>
          </span>
        </div>

        {/* ── Servicio ─────────────────────────────────────────────────── */}
        <p className="mt-5 text-xs font-medium text-muted-foreground">
          {escaparate("eligeServicio")}
        </p>
        <ul className="mt-2 space-y-2">
          {servicios.map((cada) => {
            const elegido = cada.id === servicioId
            return (
              <li key={cada.id}>
                <button
                  type="button"
                  onClick={() => setServicioId(cada.id)}
                  aria-pressed={elegido}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    elegido
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40 hover:bg-secondary"
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{servicio_(cada.id)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" aria-hidden />
                      {t("minutos", { cantidad: cada.minutos })}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatMoney(cada.precio[moneda], moneda, locale)}
                  </span>
                  {elegido && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>

        {/* ── Barbero ──────────────────────────────────────────────────── */}
        <p className="mt-5 text-xs font-medium text-muted-foreground">{escaparate("conQuien")}</p>
        <ul className="mt-2 space-y-2">
          {barberos.map((cada) => {
            const elegido = cada.id === barberoId
            return (
              <li key={cada.id}>
                <button
                  type="button"
                  onClick={() => setBarberoId(cada.id)}
                  aria-pressed={elegido}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors",
                    elegido
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40 hover:bg-secondary"
                  )}
                >
                  {cada.id === "cualquiera" ? (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
                      <Scissors className="size-3.5" aria-hidden />
                    </span>
                  ) : (
                    <InitialsAvatar iniciales={cada.iniciales} className="shrink-0" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {nombreBarbero(cada.nombre)}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {especialidad(cada.id)}
                    </span>
                  </span>
                  {elegido && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>

        {/* ── Hora ─────────────────────────────────────────────────────── */}
        <p className="mt-5 text-xs font-medium text-muted-foreground">{escaparate("hoy")}</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {horas.map((cada) => {
            const elegida = cada.hora === hora
            return (
              <button
                key={cada.hora}
                type="button"
                disabled={!cada.libre}
                onClick={() => setHora(cada.hora)}
                aria-pressed={elegida}
                className={cn(
                  "rounded-lg border py-2 text-center text-xs tabular-nums transition-colors",
                  !cada.libre &&
                    "cursor-not-allowed border-transparent bg-muted text-muted-foreground/60 line-through",
                  cada.libre &&
                    (elegida
                      ? "cursor-pointer border-primary bg-primary font-medium text-primary-foreground"
                      : "cursor-pointer border-border text-foreground hover:border-primary/40 hover:bg-secondary")
                )}
              >
                {cada.hora}
              </button>
            )
          })}
        </div>

        {/* ── Método de pago ───────────────────────────────────────────── */}
        <p className="mt-5 text-xs font-medium text-muted-foreground">
          {escaparate("comoVasAPagar")}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {metodosPago.map(({ id, icono: Icono }) => {
            const elegido = id === metodo
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMetodo(id)}
                aria-pressed={elegido}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[11px] font-medium transition-colors",
                  elegido
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-secondary"
                )}
              >
                <Icono className={cn("size-3.5", elegido && "text-primary")} aria-hidden />
                {escaparate(`pagos.${id}`)}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {escaparate("avisoPago")}
        </p>

        {/* ── Resumen ──────────────────────────────────────────────────── */}
        <div className="mt-5 rounded-xl border border-border bg-secondary/60 p-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`${servicio.id}-${barbero.id}-${hora}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-xs leading-relaxed text-muted-foreground"
            >
              {escaparate("resumen", {
                servicio: servicio_(servicio.id),
                barbero: nombreBarbero(barbero.nombre),
                hora,
              })}
            </motion.p>
          </AnimatePresence>
          <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
            <span className="text-xs text-muted-foreground">{escaparate("total")}</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={servicio.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="text-base font-semibold tabular-nums"
              >
                {formatMoney(servicio.precio[moneda], moneda, locale)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <span className="mt-4 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-transform duration-300 motion-safe:hover:scale-[1.02]">
          {escaparate("reservar")}
        </span>
      </div>
    </div>
  )
}
