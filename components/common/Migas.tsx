import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export interface Miga {
  /**
   * Sin `href` se pinta como texto y no como enlace.
   *
   * Pasa en dos casos distintos: la página actual —que no se enlaza a sí
   * misma— y un nivel que **no tiene página**, como «Legal», que agrupa tres
   * documentos y no es ninguno. Enlazarlo al primero sería un enlace que lleva
   * a algo distinto de lo que nombra, y eso es de lo que enseña a desconfiar
   * del resto de la navegación.
   */
  href?: string
  texto: string
}

interface MigasProps {
  /** Sin la de inicio: la pone este componente, que es siempre la misma. */
  migas: Miga[]
}

/**
 * Dónde está quien lee, y por dónde se sale.
 *
 * ── Qué problema resuelve ───────────────────────────────────────────────────
 * Se llega a un documento legal desde el pie, y ahí la cabecera deja de
 * orientar: ninguna de sus cuatro secciones es «legal», así que **nada aparece
 * como activo** y la única salida visible es el logotipo. La página parecía no
 * tener vuelta atrás aunque la cabecera estuviera delante.
 *
 * Las migas son la respuesta estándar a eso —lo son para jerarquías de tres
 * niveles, que es justo `/es/legal/terminos`— y de paso dan la salida al nivel
 * de arriba, que es lo que se busca al llegar por un enlace suelto.
 *
 * ── Por qué el último no es enlace ──────────────────────────────────────────
 * Porque es la página en la que ya se está. Un enlace que no lleva a ninguna
 * parte enseña a desconfiar del resto. Se marca con `aria-current="page"` para
 * que un lector de pantalla diga lo mismo que el color.
 *
 * ── Sin JSON-LD aquí ────────────────────────────────────────────────────────
 * El `BreadcrumbList` lo declara la PÁGINA con `grafoPagina()` (`lib/seo.ts`),
 * junto al resto de su grafo: un componente de presentación que además publica
 * datos estructurados acaba emitiéndolos dos veces el día que se use dos veces.
 *
 * Los dos NO dicen exactamente lo mismo, y es deliberado: aquí se pinta «Legal»
 * porque orienta a quien lee, y allí se omite porque un escalón intermedio sin
 * dirección es una posición de la ruta a la que no se puede ir. Lo visible
 * explica; lo estructurado se navega.
 */
export function Migas({ migas }: MigasProps) {
  const t = useTranslations("navegacion")

  const todas: Miga[] = [{ href: "/", texto: t("inicio") }, ...migas]

  return (
    <nav aria-label={t("migas")}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground">
        {todas.map((miga, indice) => {
          const ultima = indice === todas.length - 1
          return (
            <li key={miga.texto} className="flex items-center gap-1">
              {indice > 0 && (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden />
              )}
              {miga.href && !ultima ? (
                // `min-h-11` aunque el texto sea pequeño: es el área que se
                // pulsa con el pulgar, y en móvil estas migas son la vuelta.
                <Link
                  href={miga.href}
                  className="inline-flex min-h-11 items-center rounded-md px-1 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {miga.texto}
                </Link>
              ) : (
                // `aria-current` SOLO en la última. Un nivel intermedio sin
                // página —«Legal», que agrupa tres documentos y no es ninguno—
                // no es «donde estás», y anunciarlo así desorienta a quien
                // navega con lector de pantalla.
                <span
                  aria-current={ultima ? "page" : undefined}
                  className={ultima ? "px-1 font-medium text-foreground" : "px-1"}
                >
                  {miga.texto}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
