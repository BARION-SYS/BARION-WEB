import { CalendarDays, Check, Users } from "lucide-react"
import type { CodigoRegion } from "@/config/regiones"
import { EscaparateDemo } from "@/components/sections/EscaparateDemo"
import { pasosReserva } from "@/constants/valor"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"

/**
 * El panel y el escaparate, dibujados con componentes.
 *
 * No son capturas: una imagen del producto envejece al día siguiente de cada
 * cambio de UI y pesa. Construidos con los mismos tokens del tema, se ven
 * correctos en claro y en oscuro y no cuestan una petición de red.
 */
interface LandingVistaPreviaProps {
  region: CodigoRegion
}

export function VistaPrevia({ region }: LandingVistaPreviaProps) {
  return (
    <section
      id="vista-previa"
      className="flex min-h-dvh scroll-mt-20 flex-col justify-center border-b border-border bg-secondary/40 py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <RevelarEnScroll className="max-w-3xl">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Dos caras del mismo sistema
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            El panel es tuyo. El escaparate es el que enseñas
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tu barbería tiene su propia dirección pública. El cliente entra, elige servicio y
            barbero, y la cita aparece en tu agenda. Sin llamadas y sin instalar nada.
          </p>
        </RevelarEnScroll>

        <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {pasosReserva.map((paso, indice) => (
            <RevelarEnScroll key={paso.numero} retardo={indice * 0.08}>
              <li className="group relative h-full rounded-2xl border border-border bg-card p-6 transition-[border-color,transform] duration-300 hover:border-primary/40 motion-safe:hover:-translate-y-1">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground tabular-nums">
                  {paso.numero}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {paso.descripcion}
                </p>
                {/* Hilo entre pasos: la secuencia se ve, no se deduce */}
                {indice < pasosReserva.length - 1 && (
                  <span
                    className="absolute top-1/2 -right-3 hidden h-px w-6 bg-border sm:block"
                    aria-hidden
                  />
                )}
              </li>
            </RevelarEnScroll>
          ))}
        </ol>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
          <RevelarEnScroll recorrido="izquierda" className="lg:col-span-3">
            <MarcoPanel />
          </RevelarEnScroll>
          <RevelarEnScroll recorrido="derecha" retardo={0.12} className="lg:col-span-2">
            <figure>
              <EscaparateDemo region={region} />
              <figcaption className="mt-3 text-sm text-muted-foreground">
                El escaparate: lo que ve tu cliente en su móvil. Pruébalo — elige servicio, barbero,
                hora y cómo paga.
              </figcaption>
            </figure>
          </RevelarEnScroll>
        </div>
      </div>
    </section>
  )
}

const filas = [
  { hora: "09:00", cliente: "Andrés Villa", servicio: "Corte + barba", barbero: "Iván" },
  { hora: "10:30", cliente: "Julián Mesa", servicio: "Fade clásico", barbero: "Duván" },
  { hora: "11:30", cliente: "Samuel Ríos", servicio: "Afeitado a navaja", barbero: "Iván" },
  { hora: "12:15", cliente: "Mateo Cano", servicio: "Corte niño", barbero: "Duván" },
]

function MarcoPanel() {
  return (
    <figure>
      <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[box-shadow,transform,border-color] duration-300 hover:border-primary/30 hover:shadow-xl motion-safe:hover:-translate-y-1">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <span className="ml-2 truncate rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
            barion.app/dashboard/citas
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-semibold">Citas de hoy</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
              <CalendarDays className="size-3" aria-hidden />
              Miércoles 14
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Users className="size-3.5" aria-hidden />2 barberos en silla
            </span>
          </div>

          <ul className="mt-4 divide-y divide-border">
            {filas.map((fila) => (
              <li
                key={fila.hora}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-secondary"
              >
                <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                  {fila.hora}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{fila.cliente}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {fila.servicio} · {fila.barbero}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-(--exito)/10 px-2 py-0.5 text-[10px] font-medium text-(--exito)">
                  <Check className="size-3" aria-hidden />
                  Confirmada
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">
        El panel: la agenda del día, con quién viene y quién lo atiende.
      </figcaption>
    </figure>
  )
}
