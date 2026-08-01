import Link from "next/link"
import { ArrowRight, Clock3, Link2, Scissors } from "lucide-react"
import { anclas, rutasApp } from "@/config/rutas"
import { Button } from "@/components/ui/button"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"

// Qué pasa después de pulsar el botón. Enseñarlo quita la duda de «esto cuánto
// me va a costar montarlo», que es lo que frena en el último paso.
const puestaEnMarcha = [
  {
    icono: Clock3,
    titulo: "Creas tu barbería",
    descripcion: "Cuatro campos: nombre, correo, teléfono y tu dirección pública. Dos minutos.",
  },
  {
    icono: Scissors,
    titulo: "Cargas servicios y barberos",
    descripcion: "Precio, duración y quién atiende cada cosa. La agenda ya sabe con eso.",
  },
  {
    icono: Link2,
    titulo: "Compartes tu enlace",
    descripcion:
      "Por WhatsApp, en tu perfil o con el QR del local. El primer cliente ya puede reservar.",
  },
]

// Segunda oportunidad de la página: el mismo mensaje del hero y el botón. Sin
// formulario — la puerta sigue siendo el registro.
export function Cierre() {
  return (
    <section className="flex min-h-dvh flex-col justify-center border-b border-border bg-secondary/40 py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <RevelarEnScroll
          recorrido="zoom"
          className="relative isolate overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center sm:px-14 lg:py-20"
        >
          {/* Dos resplandores del oro de marca: dan cuerpo a la franja de cierre
              sin meter otra imagen ni otro color al sistema */}
          <span
            className="pointer-events-none absolute -top-24 -left-16 -z-10 size-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -right-16 -bottom-28 -z-10 size-72 rounded-full bg-primary/[0.07] blur-3xl"
            aria-hidden
          />

          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Tu barbería, ordenada desde esta tarde
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Creas la barbería, cargas tus servicios y compartes tu enlace. El primer cliente puede
            reservar hoy mismo.
          </p>

          <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {puestaEnMarcha.map(({ icono: Icono, titulo, descripcion }, indice) => (
              <li
                key={titulo}
                className="rounded-2xl border border-border bg-background/60 p-6 transition-[border-color,transform] duration-300 hover:border-primary/40 motion-safe:hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icono className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                    Paso {indice + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{descripcion}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              render={<a href={rutasApp.registro} />}
              nativeButton={false}
              size="lg"
              className="group/cta h-12 rounded-xl px-7 text-base font-semibold transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Empezar la prueba
              <ArrowRight
                className="transition-transform duration-200 group-hover/cta:translate-x-1"
                aria-hidden
              />
            </Button>
            <Button
              render={<Link href={anclas.precios} />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="h-12 rounded-xl px-7 text-base font-semibold transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Ver los planes
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">15 días de prueba · Sin tarjeta</p>
        </RevelarEnScroll>
      </div>
    </section>
  )
}
