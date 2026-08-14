import { useTranslations } from "next-intl"
import { Mail } from "lucide-react"
import { LogoBarion } from "@/components/brand/LogoBarion"
import { CORREO_CONTACTO, rutas, rutasApp, rutasMaquina } from "@/config/rutas"
import { Link } from "@/i18n/navigation"
import { CONTENEDOR } from "@/lib/superficies"

const CLASES_ENLACE =
  "group inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"

const CLASES_SUBRAYADO =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]"

interface Enlace {
  href: string
  texto: string
  /** Fuera de este dominio: `<a>` y no `next/link`. */
  externo?: boolean
}

/**
 * El pie: la marca, las secciones, por dónde se empieza y lo legal.
 *
 * ── Cómo navega cada enlace, que no es igual en los tres bloques ────────────
 * Las secciones y lo legal son **páginas de este sitio**: `next/link`, que las
 * prefetchea. Entrar y registrarse son de la aplicación —otro dominio, otro
 * despliegue— y van con `<a>`, porque `next/link` sobre un origen ajeno solo
 * añade ruido. Antes convivían anclas y dominios ajenos en la misma lista y por
 * eso TODO iba con `<a>`; con las secciones convertidas en páginas esa mezcla ya
 * no existe, y el pie navega como debe.
 *
 * Los nombres de las secciones llegan del mismo sitio que los de la cabecera: en
 * dos listas, la que se queda vieja es siempre la de abajo.
 */
export function Footer() {
  const t = useTranslations("pie")
  // Los nombres de las secciones son los MISMOS que en la cabecera: en dos
  // listas, la que se queda vieja es siempre la de abajo.
  const nav = useTranslations("navegacion")
  const columnas: { titulo: string; enlaces: Enlace[] }[] = [
    {
      titulo: t("producto"),
      enlaces: [
        { href: rutas.producto, texto: nav("secciones.producto") },
        { href: rutas.vistaPrevia, texto: nav("secciones.vistaPrevia") },
        { href: rutas.precios, texto: nav("secciones.precios") },
        { href: rutas.preguntas, texto: nav("secciones.preguntas") },
      ],
    },
    {
      titulo: t("empezar"),
      enlaces: [
        { href: rutasApp.registro, texto: t("crearBarberia"), externo: true },
        { href: rutasApp.entrar, texto: t("entrarAlPanel"), externo: true },
      ],
    },
    {
      // Va en el pie y no escondido en una página de ayuda: es donde se busca, y
      // que se encuentre sin preguntar es parte de lo que hace creíble a un
      // producto que cobra.
      titulo: t("legal"),
      enlaces: [
        { href: rutas.terminos, texto: t("terminos") },
        { href: rutas.privacidad, texto: t("privacidad") },
        { href: rutas.cookies, texto: t("cookies") },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-background py-14">
      <div className={CONTENEDOR}>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-5">
          <div className="col-span-2">
            <LogoBarion variante="completo" className="h-8 lg:h-9" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("descripcion")}
            </p>
            <a
              href={`mailto:${CORREO_CONTACTO}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="size-4" aria-hidden />
              {CORREO_CONTACTO}
            </a>
          </div>

          {columnas.map((columna) => (
            <div key={columna.titulo}>
              <h2 className="text-sm font-semibold">{columna.titulo}</h2>
              <ul className="mt-4 space-y-1">
                {columna.enlaces.map((enlace) => (
                  <li key={enlace.href}>
                    {enlace.externo ? (
                      <a href={enlace.href} className={CLASES_ENLACE}>
                        <span className={CLASES_SUBRAYADO}>{enlace.texto}</span>
                      </a>
                    ) : (
                      <Link href={enlace.href} className={CLASES_ENLACE}>
                        <span className={CLASES_SUBRAYADO}>{enlace.texto}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {t("derechos", { anio: String(new Date().getFullYear()) })}
          </p>
          <div className="flex items-center gap-4">
            {/* El único enlace real a `/llms.txt`. Un rastreador llega a una
                dirección porque alguien enlaza a ella: sin esto, el archivo
                existe y no lo encuentra nadie. */}
            <a
              href={rutasMaquina.llms}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              llms.txt
            </a>
            {/* Discreto a propósito: esta puerta la usan cinco personas por
                barbería, no quinientas. No compite con el registro. */}
            <a
              href={rutasApp.entrar}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {nav("yaTienesCuenta")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
