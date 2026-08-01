"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Banknote, Check, Clock, CreditCard, MapPin, Scissors, Smartphone } from "lucide-react"
import { regiones, type CodigoMoneda, type CodigoRegion } from "@/config/regiones"
import { InitialsAvatar } from "@/components/common/InitialsAvatar"
import { formatMoney } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface LandingEscaparateDemoProps {
  region: CodigoRegion
}

// Precios declarados POR MONEDA, nunca convertidos: un `usd × tasa` en el
// cliente es un precio inventado, y en una demo se leería igual de real.
//
// En unidad menor, como TODO el dinero del sistema: 3_500_000 son $ 35.000, no
// tres millones y medio. El peso no se escapa de la regla por enseñarse sin
// decimales — ver la tabla de escalas de `lib/currency.ts`.
const servicios = [
  {
    id: "clasico",
    nombre: "Corte clásico",
    duracion: "40 min",
    precio: { COP: 3_500_000, USD: 2_500, EUR: 2_200 } as Record<CodigoMoneda, number>,
  },
  {
    id: "corte-barba",
    nombre: "Corte + barba",
    duracion: "60 min",
    precio: { COP: 5_200_000, USD: 3_800, EUR: 3_400 } as Record<CodigoMoneda, number>,
  },
  {
    id: "navaja",
    nombre: "Afeitado a navaja",
    duracion: "30 min",
    precio: { COP: 2_800_000, USD: 2_000, EUR: 1_800 } as Record<CodigoMoneda, number>,
  },
]

const barberos = [
  { id: "cualquiera", nombre: "Cualquiera", iniciales: "", detalle: "El primero libre" },
  { id: "ivan", nombre: "Iván Duarte", iniciales: "ID", detalle: "Fades y diseño" },
  { id: "duvan", nombre: "Duván Ríos", iniciales: "DR", detalle: "Clásico y navaja" },
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
  { id: "efectivo", nombre: "Efectivo", icono: Banknote },
  { id: "tarjeta", nombre: "Tarjeta", icono: CreditCard },
  { id: "transferencia", nombre: "Transferencia", icono: Smartphone },
]

/**
 * El escaparate, tal y como lo usa el cliente de la barbería: elige servicio,
 * barbero, hora y con qué paga. Es la maqueta que MÁS vende de la página —el
 * dueño se está imaginando a su cliente aquí— y una maqueta que no responde al
 * dedo no cuenta esa historia.
 */
export function EscaparateDemo({ region }: LandingEscaparateDemoProps) {
  const { moneda, locale } = regiones[region]
  const [servicioId, setServicioId] = useState(servicios[0].id)
  const [barberoId, setBarberoId] = useState(barberos[1].id)
  const [hora, setHora] = useState("10:30")
  const [metodo, setMetodo] = useState(metodosPago[0].id)

  const servicio = servicios.find((s) => s.id === servicioId) ?? servicios[0]
  const barbero = barberos.find((b) => b.id === barberoId) ?? barberos[0]

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
            <span className="block truncate text-sm font-semibold">Barbería Central</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" aria-hidden />
              Medellín · Laureles
            </span>
          </span>
        </div>

        {/* ── Servicio ─────────────────────────────────────────────────── */}
        <p className="mt-5 text-xs font-medium text-muted-foreground">Elige tu servicio</p>
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
                    <span className="block truncate text-sm font-medium">{cada.nombre}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" aria-hidden />
                      {cada.duracion}
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
        <p className="mt-5 text-xs font-medium text-muted-foreground">Con quién</p>
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
                    <span className="block truncate text-sm font-medium">{cada.nombre}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {cada.detalle}
                    </span>
                  </span>
                  {elegido && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>

        {/* ── Hora ─────────────────────────────────────────────────────── */}
        <p className="mt-5 text-xs font-medium text-muted-foreground">Hoy</p>
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
        <p className="mt-5 text-xs font-medium text-muted-foreground">Cómo vas a pagar</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {metodosPago.map(({ id, nombre, icono: Icono }) => {
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
                {nombre}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Se registra para la caja de la barbería. Barion no cobra al cliente.
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
              <span className="font-medium text-foreground">{servicio.nombre}</span> con{" "}
              <span className="font-medium text-foreground">{barbero.nombre}</span> hoy a las{" "}
              <span className="font-medium text-foreground tabular-nums">{hora}</span>
            </motion.p>
          </AnimatePresence>
          <div className="mt-2 flex items-baseline justify-between border-t border-border pt-2">
            <span className="text-xs text-muted-foreground">Total</span>
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
          Reservar
        </span>
      </div>
    </div>
  )
}
