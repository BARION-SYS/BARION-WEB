import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import { cn } from "@/lib/utils"

interface EncabezadoSeccionProps {
  etiqueta: string
  titulo: string
  entrada: string
  /** `h1` en una página propia, `h2` cuando es un bloque de la portada. */
  nivel?: "h1" | "h2"
  /** El enlace a la página completa. Solo aparece en los resúmenes. */
  enlace?: { href: string; texto: string }
  /** Contenido a la derecha en pantallas anchas (el selector de país). */
  acompanante?: React.ReactNode
  className?: string
}

/**
 * El encabezado de una sección. **Uno solo para todas.**
 *
 * ── Qué arregla ────────────────────────────────────────────────────────────
 * Cada sección traía su propio encabezado copiado a mano, con las mismas cinco
 * clases repetidas seis veces. Eso no es un problema de líneas: es que las seis
 * empezaron a separarse —una con `max-w-3xl` y otra sin él, una con `mt-4` y
 * otra con `mt-5`— y la página se leía con el ritmo roto sin que se pudiera
 * señalar dónde. Con un solo componente, el ritmo es una decisión y no un
 * descuido.
 *
 * ── Por qué el nivel es una prop ───────────────────────────────────────────
 * La misma sección es `h1` en su página —donde ES el tema— y `h2` en la
 * portada, donde es uno de varios bloques. Un documento con dos `h1` o con un
 * `h2` suelto sin `h1` encima no solo se posiciona peor: se navega mal con un
 * lector de pantalla, que salta por títulos.
 */
export function EncabezadoSeccion({
  etiqueta,
  titulo,
  entrada,
  nivel = "h2",
  enlace,
  acompanante,
  className,
}: EncabezadoSeccionProps) {
  const Titulo = nivel

  return (
    <RevelarEnScroll
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12",
        className
      )}
    >
      <div className="max-w-3xl">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">{etiqueta}</p>
        <Titulo
          className={cn(
            "mt-4 font-bold tracking-tight text-balance",
            nivel === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl"
          )}
        >
          {titulo}
        </Titulo>
        <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {entrada}
        </p>
      </div>

      {acompanante}

      {enlace && (
        <Link
          href={enlace.href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-primary"
        >
          {enlace.texto}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      )}
    </RevelarEnScroll>
  )
}
