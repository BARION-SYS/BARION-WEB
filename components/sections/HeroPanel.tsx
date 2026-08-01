"use client"

import { useState } from "react"
import { AnimatePresence, motion, useSpring, useTransform, type MotionValue } from "motion/react"
import {
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  Scissors,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"
import type { CodigoMoneda } from "@/config/regiones"
import { LogoBarion } from "@/components/brand/LogoBarion"
import { formatMoney } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface LandingHeroPanelProps {
  moneda: CodigoMoneda
  locale: string
  /** Progreso de scroll del hero (0 arriba del todo, 1 fuera de pantalla). */
  progreso: MotionValue<number>
}

const navegacion = [
  { icono: LayoutDashboard, etiqueta: "Resumen", activo: false },
  { icono: CalendarDays, etiqueta: "Agenda", activo: true },
  { icono: Users, etiqueta: "Clientes", activo: false },
  { icono: Scissors, etiqueta: "Barberos", activo: false },
  { icono: Wallet, etiqueta: "Nómina", activo: false },
  { icono: BarChart3, etiqueta: "Estadísticas", activo: false },
  { icono: Settings, etiqueta: "Configuración", activo: false },
]

/** Media hora por fila; el rail marca las horas en punto. */
const ALTO_FILA = 1.4
const horas = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]

// Cada día trae su propia jornada y su propio resumen: al elegirlo cambia el
// detalle de abajo. Una barbería real tiene días flojos y días llenos.
const dias = [
  {
    letra: "LUN",
    servicioTop: "Corte clásico",
    numero: 12,
    ocupacion: 62,
    factorIngreso: 0.68,
    barbero: "Iván",
    citas: [
      { fila: 0, alto: 2, cliente: "Andrés V.", servicio: "Corte + barba", tono: "oro" },
      { fila: 4, alto: 2, cliente: "Mateo C.", servicio: "Corte niño", tono: "suave" },
      { fila: 8, alto: 3, cliente: "Óscar T.", servicio: "Ritual completo", tono: "oro" },
    ],
  },
  {
    letra: "MAR",
    servicioTop: "Fade clásico",
    numero: 13,
    ocupacion: 74,
    factorIngreso: 0.81,
    barbero: "Duván",
    citas: [
      { fila: 1, alto: 3, cliente: "Julián M.", servicio: "Fade clásico", tono: "suave" },
      { fila: 6, alto: 2, cliente: "Ricardo P.", servicio: "Afeitado", tono: "oro" },
      { fila: 9, alto: 2, cliente: "Bruno E.", servicio: "Corte clásico", tono: "suave" },
    ],
  },
  {
    letra: "MIÉ",
    servicioTop: "Corte + barba",
    numero: 14,
    hoy: true,
    ocupacion: 86,
    factorIngreso: 1,
    barbero: "Iván",
    citas: [
      { fila: 0, alto: 2, cliente: "Samuel R.", servicio: "Corte + barba", tono: "oro" },
      { fila: 3, alto: 2, cliente: "Iván D.", servicio: "Diseño", tono: "oro" },
      { fila: 6, alto: 3, cliente: "Tomás L.", servicio: "Ritual completo", tono: "oro" },
      { fila: 10, alto: 2, cliente: "Hugo N.", servicio: "Fade + barba", tono: "suave" },
    ],
  },
  {
    letra: "JUE",
    servicioTop: "Fade + barba",
    numero: 15,
    ocupacion: 55,
    factorIngreso: 0.6,
    barbero: "Duván",
    citas: [
      { fila: 2, alto: 2, cliente: "Nicolás A.", servicio: "Fade + barba", tono: "suave" },
      { fila: 7, alto: 2, cliente: "Pablo G.", servicio: "Corte clásico", tono: "oro" },
    ],
  },
  {
    letra: "VIE",
    servicioTop: "Color + corte",
    numero: 16,
    ocupacion: 93,
    factorIngreso: 1.18,
    barbero: "Iván",
    citas: [
      { fila: 1, alto: 2, cliente: "Emilio S.", servicio: "Corte clásico", tono: "suave" },
      { fila: 5, alto: 3, cliente: "Damián O.", servicio: "Color + corte", tono: "oro" },
      { fila: 9, alto: 2, cliente: "Lucas B.", servicio: "Corte + barba", tono: "oro" },
    ],
  },
]

// Importe de muestra por moneda, en unidad menor. Se declara por moneda y no se
// convierte: un `usd × tasa` en el cliente es un precio inventado. El factor de
// cada día escala DENTRO de la misma moneda, que es otra cosa.
//
// Unidad menor de verdad, también en pesos: 128_000_000 son $ 1.280.000 de caja
// en un día, que es lo que corresponde a los USD 320 de al lado.
const ingresoDemo: Record<CodigoMoneda, number> = {
  COP: 128_000_000,
  USD: 32_000,
  EUR: 29_000,
}

/**
 * El panel, visto DE LADO y en vertical.
 *
 * El giro no es adorno: de frente, la captura compite con el titular por la
 * misma atención y el bloque entero se lee como una tabla. En perspectiva se lee
 * como un objeto —algo que existe y se usa— y el texto conserva la jerarquía. Al
 * bajar, el scroll lo endereza: quien sigue leyendo termina viéndolo de frente
 * sin haber tocado nada.
 *
 * Y se puede tocar: elegir un día cambia la semana, el resumen y la actividad.
 * Un producto que no responde al puntero se enseña como una fotografía, y lo que
 * hay que enseñar es que funciona.
 */
export function HeroPanel({ moneda, locale, progreso }: LandingHeroPanelProps) {
  const [diaActivo, setDiaActivo] = useState(2)
  const dia = dias[diaActivo]
  const base = ingresoDemo[moneda]
  const ingresoDelDia = Math.round(base * dia.factorIngreso)
  const citasDelDia = dia.citas.length * 4
  // Escalan DENTRO de la misma moneda: no hay conversión por ninguna parte.
  const ingresoSemana = dias.reduce((total, cada) => total + base * cada.factorIngreso, 0)
  const techoBarra = Math.max(...dias.map((cada) => cada.factorIngreso))

  const indicadores = [
    {
      icono: TrendingUp,
      etiqueta: "Ingresos",
      valor: formatMoney(ingresoDelDia, moneda, locale),
    },
    { icono: CalendarDays, etiqueta: "Citas", valor: String(dia.citas.length * 4) },
    { icono: Users, etiqueta: "Ocupación", valor: `${dia.ocupacion} %` },
  ]

  // Muelle de por medio: sin él el giro copia el salto de la rueda del ratón en
  // vez de acompañarlo.
  const giroCrudo = useTransform(progreso, [0, 0.6], [-14, -2])
  const inclinacionCruda = useTransform(progreso, [0, 0.6], [6, 0])
  const giro = useSpring(giroCrudo, { stiffness: 90, damping: 24, mass: 0.6 })
  const inclinacion = useSpring(inclinacionCruda, { stiffness: 90, damping: 24, mass: 0.6 })

  return (
    <div className="[perspective:1600px]">
      <motion.div
        style={{ rotateY: giro, rotateX: inclinacion }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="relative [transform-style:preserve-3d]"
      >
        {/* Resplandor cálido detrás — profundidad sin tocar la fotografía */}
        <div
          className="pointer-events-none absolute -inset-10 rounded-[56px] bg-hero-primary/10 blur-3xl"
          aria-hidden
        />

        <div className="relative overflow-hidden rounded-3xl border border-hero-borde bg-hero-superficie shadow-2xl sm:rounded-[32px]">
          {/* Barra de ventana */}
          <div className="flex items-center gap-3 border-b border-hero-borde px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-hero-suave" />
              <span className="size-2.5 rounded-full bg-hero-suave" />
              <span className="size-2.5 rounded-full bg-hero-suave" />
            </div>
            <p className="truncate text-[11px] font-medium text-hero-muted">
              Barbería Central · Semana del 12
            </p>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-hero-borde px-2 py-0.5 text-[10px] font-medium text-hero-muted">
              <motion.span
                className="size-1.5 rounded-full bg-hero-exito"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              En vivo
            </span>
          </div>

          <div className="flex">
            {/* Barra lateral */}
            <nav className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-hero-borde py-4 sm:flex">
              {/* La marca donde está en el panel de verdad: arriba del todo */}
              <LogoBarion variante="icono" className="mb-4 h-6" />
              {navegacion.map(({ icono: Icono, etiqueta, activo }) => (
                <span
                  key={etiqueta}
                  title={etiqueta}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    activo ? "bg-hero-primary/15 text-hero-primary" : "text-hero-sutil"
                  )}
                >
                  <Icono className="size-4" aria-hidden />
                </span>
              ))}
              <span
                className="mt-auto size-8 rounded-full border border-hero-borde bg-hero-superficie-alta"
                aria-hidden
              />
            </nav>

            <div className="min-w-0 flex-1 p-4">
              {/* Indicadores del día elegido. El importe se anima al cambiar:
                  sin eso, tocar un día parecería no hacer nada */}
              <div className="grid grid-cols-3 gap-2">
                {indicadores.map(({ icono: Icono, etiqueta, valor }) => (
                  <div
                    key={etiqueta}
                    className="rounded-xl border border-hero-borde bg-hero-superficie-alta px-3 py-2"
                  >
                    <p className="flex items-center gap-1.5 text-[10px] text-hero-muted">
                      <Icono className="size-3 text-hero-primary" aria-hidden />
                      {etiqueta}
                    </p>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.p
                        key={valor}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="mt-1 truncate text-sm font-semibold text-hero-foreground tabular-nums"
                      >
                        {valor}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* La semana en COLUMNAS: es un calendario, no una tabla de filas */}
              <div className="mt-3 rounded-2xl border border-hero-borde bg-hero-superficie-alta/50 p-3">
                <div className="grid grid-cols-[2.25rem_repeat(5,minmax(0,1fr))] gap-x-1">
                  <span />
                  {dias.map((cadaDia, indice) => {
                    const activo = indice === diaActivo
                    return (
                      <button
                        key={cadaDia.numero}
                        type="button"
                        onClick={() => setDiaActivo(indice)}
                        aria-pressed={activo}
                        className={cn(
                          "relative cursor-pointer rounded-lg pt-1 pb-2 text-center transition-colors",
                          activo
                            ? "text-hero-foreground"
                            : "text-hero-muted hover:text-hero-foreground"
                        )}
                      >
                        <span className="block text-[10px] font-medium tracking-wider">
                          {cadaDia.letra}
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold tabular-nums">
                          {cadaDia.numero}
                        </span>
                        {activo && (
                          <motion.span
                            layoutId="dia-elegido"
                            className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-hero-primary"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                      </button>
                    )
                  })}

                  {/* Rail de horas */}
                  <div className="grid grid-rows-[repeat(6,2.8rem)] pt-1">
                    {horas.map((hora) => (
                      <span key={hora} className="text-[10px] text-hero-sutil tabular-nums">
                        {hora}
                      </span>
                    ))}
                  </div>

                  {dias.map((cadaDia, indiceDia) => (
                    <div
                      key={cadaDia.numero}
                      className={cn(
                        "relative rounded-lg pt-1 transition-colors",
                        indiceDia === diaActivo
                          ? "bg-hero-primary/5"
                          : "hover:bg-hero-primary/[0.03]"
                      )}
                    >
                      {/* Pauta horaria */}
                      <div className="grid grid-rows-[repeat(6,2.8rem)]" aria-hidden>
                        {horas.map((hora) => (
                          <div key={hora} className="border-t border-hero-borde/40" />
                        ))}
                      </div>

                      {cadaDia.citas.map((cita) => (
                        <motion.div
                          key={`${cadaDia.numero}-${cita.fila}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: indiceDia === diaActivo ? 1 : 0.55,
                            scale: 1,
                          }}
                          transition={{
                            opacity: { duration: 0.25 },
                            scale: {
                              duration: 0.3,
                              ease: "easeOut",
                              delay: 0.5 + indiceDia * 0.06,
                            },
                          }}
                          className={cn(
                            "absolute inset-x-0.5 overflow-hidden rounded-md px-1.5 py-1",
                            cita.tono === "oro"
                              ? "border border-hero-primary/40 bg-hero-primary/15"
                              : "border border-hero-borde bg-hero-superficie"
                          )}
                          style={{
                            top: `${0.25 + cita.fila * ALTO_FILA}rem`,
                            height: `calc(${cita.alto * ALTO_FILA}rem - 0.2rem)`,
                          }}
                        >
                          <p className="truncate text-[10px] font-medium text-hero-foreground">
                            {cita.cliente}
                          </p>
                          <p className="truncate text-[10px] text-hero-muted">{cita.servicio}</p>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas de la semana. Las barras se eligen igual que los días
                  de arriba: dos maneras de tocar lo mismo, siempre en fase */}
              <div className="mt-3 rounded-2xl border border-hero-borde bg-hero-superficie-alta/50 p-3">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-hero-muted uppercase">
                      Ingresos de la semana
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-hero-foreground tabular-nums">
                      {formatMoney(Math.round(ingresoSemana), moneda, locale)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-hero-exito/10 px-2 py-0.5 text-[10px] font-medium text-hero-exito tabular-nums">
                    +18 % vs. semana pasada
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-5 gap-1.5">
                  {dias.map((cada, indice) => {
                    const activo = indice === diaActivo
                    return (
                      <button
                        key={cada.numero}
                        type="button"
                        onClick={() => setDiaActivo(indice)}
                        aria-label={`Ver ${cada.letra} ${cada.numero}`}
                        aria-pressed={activo}
                        className="group/barra flex cursor-pointer flex-col items-center gap-1"
                      >
                        <span className="flex h-14 w-full items-end justify-center">
                          {/* Escala vertical, no altura: animar `height` obliga a
                              recalcular la caja en cada fotograma */}
                          <motion.span
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: cada.factorIngreso / techoBarra }}
                            transition={{
                              type: "spring",
                              stiffness: 160,
                              damping: 22,
                              delay: 0.6 + indice * 0.05,
                            }}
                            className={cn(
                              "w-full origin-bottom rounded-t-[3px] transition-colors",
                              activo
                                ? "bg-hero-primary"
                                : "bg-hero-suave group-hover/barra:bg-hero-primary/50"
                            )}
                            style={{ height: "3.5rem" }}
                          />
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-medium transition-colors",
                            activo ? "text-hero-primary" : "text-hero-sutil"
                          )}
                        >
                          {cada.letra}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Dos métricas que solo tienen sentido con el día elegido */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Metrica
                  icono={<Wallet className="size-3 text-hero-primary" aria-hidden />}
                  etiqueta="Ticket promedio"
                  valor={formatMoney(Math.round(ingresoDelDia / citasDelDia), moneda, locale)}
                />
                <Metrica
                  icono={<Scissors className="size-3 text-hero-primary" aria-hidden />}
                  etiqueta="Servicio top"
                  valor={dia.servicioTop}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avisos flotantes: el producto trabajando solo. Salen HACIA EL FRENTE
            del panel (translateZ), así que el giro los despega de verdad.
            Los dos de agenda cuelgan POR DEBAJO: ahí no tapan la semana. */}
        <TarjetaFlotante
          className="-top-5 -left-3 sm:-left-10"
          icono={<UserPlus className="size-3.5 text-hero-primary" aria-hidden />}
          titulo="Cliente registrado"
          detalle="Camila Ortega · desde el escaparate"
          retardo={1}
          profundidad={70}
        />
        <TarjetaFlotante
          className="-bottom-7 left-4 sm:left-10"
          icono={<CheckCircle2 className="size-3.5 text-hero-exito" aria-hidden />}
          titulo="Recordatorio enviado"
          detalle="Cita de mañana · 10:30"
          retardo={1.15}
          profundidad={90}
        />
        <TarjetaFlotante
          className="right-4 -bottom-12 hidden sm:right-14 sm:flex"
          icono={<Bell className="size-3.5 text-hero-primary" aria-hidden />}
          titulo="Próxima cita"
          detalle="Andrés Villa · Corte + barba"
          retardo={1.3}
          profundidad={110}
        />
      </motion.div>
    </div>
  )
}

interface MetricaProps {
  icono: React.ReactNode
  etiqueta: string
  valor: string
}

/** Dato del día elegido. Se renueva con animación o el cambio pasa inadvertido. */
function Metrica({ icono, etiqueta, valor }: MetricaProps) {
  return (
    <div className="rounded-xl border border-hero-borde bg-hero-superficie-alta px-3 py-2">
      <p className="flex items-center gap-1.5 text-[10px] text-hero-muted">
        {icono}
        {etiqueta}
      </p>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={valor}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mt-1 truncate text-xs font-semibold text-hero-foreground tabular-nums"
        >
          {valor}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

interface TarjetaFlotanteProps {
  className: string
  icono: React.ReactNode
  titulo: string
  detalle: string
  retardo: number
  /** Píxeles hacia el frente del panel: cuanto más, más se despega al girar. */
  profundidad: number
}

function TarjetaFlotante({
  className,
  icono,
  titulo,
  detalle,
  retardo,
  profundidad,
}: TarjetaFlotanteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.45, delay: retardo },
        scale: { duration: 0.45, delay: retardo },
        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: retardo },
      }}
      style={{ translateZ: profundidad }}
      className={cn(
        "absolute flex items-center gap-2 rounded-xl border border-hero-borde bg-hero-superficie/70 px-3 py-2 shadow-xl backdrop-blur-xl",
        className
      )}
      aria-hidden
    >
      {icono}
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-medium text-hero-foreground">
          {titulo}
        </span>
        <span className="block truncate text-[10px] text-hero-muted">{detalle}</span>
      </span>
    </motion.div>
  )
}
