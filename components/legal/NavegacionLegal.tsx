import { useTranslations } from "next-intl"
import { rutas } from "@/config/rutas"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

/** Los tres documentos, en el orden en que se leen. */
const DOCUMENTOS = ["terminos", "privacidad", "cookies"] as const

export type ClaveDocumentoLegal = (typeof DOCUMENTOS)[number]

interface NavegacionLegalProps {
  actual: ClaveDocumentoLegal
}

/**
 * Moverse ENTRE los tres documentos sin volver al pie.
 *
 * ── Por qué hace falta ──────────────────────────────────────────────────────
 * Los tres se leen juntos: quien mira los términos casi siempre quiere ver
 * después qué se hace con sus datos. Sin esto, ese salto obliga a recorrer un
 * documento largo hasta el pie para encontrar el enlace de al lado — y en un
 * móvil eso son varias pantallas de desplazamiento.
 *
 * Va ARRIBA, junto a las migas, y no al final: el sitio donde se decide «esto no
 * era lo que buscaba» es al llegar, no después de leerlo entero.
 *
 * El actual se marca y **no es enlace**: pulsarlo recargaría la misma página, que
 * es la forma más barata de que alguien piense que el sitio no responde.
 */
export function NavegacionLegal({ actual }: NavegacionLegalProps) {
  const t = useTranslations("pie")

  return (
    <nav aria-label={t("legal")} className="flex flex-wrap gap-2">
      {DOCUMENTOS.map((documento) => {
        const esActual = documento === actual
        const texto = t(documento)

        return esActual ? (
          <span
            key={documento}
            aria-current="page"
            className="inline-flex min-h-11 items-center rounded-xl border border-primary bg-primary/10 px-4 text-sm font-medium text-foreground"
          >
            {texto}
          </span>
        ) : (
          <Link
            key={documento}
            href={rutas[documento]}
            className={cn(
              "inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-muted-foreground",
              "transition-colors hover:border-primary/40 hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
          >
            {texto}
          </Link>
        )
      })}
    </nav>
  )
}
