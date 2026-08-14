import { CONTENEDOR } from "@/lib/superficies"
import { cn } from "@/lib/utils"

interface SeccionProps {
  children: React.ReactNode
  /**
   * De qué color es el suelo.
   *
   * Se alternan para que dos secciones seguidas nunca compartan fondo: el
   * cambio es lo que las separa. Estaba mal en la portada —precios y preguntas
   * eran las dos `bg-background`— y entre ellas solo quedaba una línea de un
   * píxel haciendo todo el trabajo.
   */
  tono?: "base" | "alterno"
  /**
   * Cuánto aire. `normal` es una sección de contenido; `compacta` es una banda
   * de servicio —anterior/siguiente— que no debe pesar como una sección.
   */
  aire?: "normal" | "compacta"
  /**
   * La línea de abajo.
   *
   * Se queda encendida aunque las secciones alternen de tono, **porque los dos
   * tonos son deliberadamente poco contrastados** —`bg-background` contra
   * `bg-secondary/40`— y en claro esa diferencia casi no se ve. La línea es la
   * que hace el corte; el tono solo lo acompaña.
   *
   * **Se apaga en la última de la página**: el pie ya trae su propio borde
   * superior, y dos pegados se ven como una raya gruesa y torcida.
   */
  separador?: boolean
  etiqueta?: string
  ariaLabel?: string
  className?: string
}

const AIRE = {
  normal: "py-24 lg:py-28",
  compacta: "py-12 lg:py-14",
} as const

const TONO = {
  base: "bg-background",
  alterno: "bg-secondary/40",
} as const

/**
 * El envoltorio de una sección: suelo, aire, separador y contenedor.
 *
 * ── Qué arregla ─────────────────────────────────────────────────────────────
 * Las seis secciones declaraban esas cuatro cosas por su cuenta, y por eso
 * divergían: el mismo `max-w` copiado seis veces, el borde inferior también en
 * la última —justo donde el pie pone el suyo— y el fondo elegido sección a
 * sección en vez de por su posición en la página.
 *
 * Con esto, **el ritmo lo decide la página** —que es quien sabe en qué orden van
 * y cuál es la última— y no cada sección por separado.
 */
export function Seccion({
  children,
  tono = "base",
  aire = "normal",
  separador = true,
  etiqueta,
  ariaLabel,
  className,
}: SeccionProps) {
  return (
    <section
      id={etiqueta}
      aria-label={ariaLabel}
      className={cn(TONO[tono], AIRE[aire], separador && "border-b border-border", className)}
    >
      <div className={CONTENEDOR}>{children}</div>
    </section>
  )
}
