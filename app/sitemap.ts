import type { MetadataRoute } from "next"
import { etiquetaHtml } from "@/config/idiomas"
import { VERSION_LEGAL } from "@/config/legal"
import { rutas, type ClaveRuta } from "@/config/rutas"
import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { urlAbsoluta } from "@/lib/seo"

/**
 * `/sitemap.xml`.
 *
 * ── Qué cambió, y por qué ───────────────────────────────────────────────────
 * Antes llevaba UNA dirección, porque el sitio era una sola página y sus
 * secciones eran anclas —y un ancla no es una URL que indexar—. Ahora cada
 * sección es una página de verdad y existe en dos idiomas, así que el mapa las
 * declara todas: 5 páginas × 2 idiomas, más los tres documentos legales.
 *
 * ── `alternates` por entrada, que es lo que hace que sirva de algo ──────────
 * Cada dirección declara sus hermanas en los otros idiomas. Sin eso, un buscador
 * ve dos sitios distintos que dicen lo mismo y elige uno; con eso, entiende que
 * son la misma página en dos idiomas y sirve la que corresponda a quien busca.
 * Es la misma afirmación que hace el `hreflang` de cada página, y se hace en los
 * dos sitios a propósito: son dos caminos por los que un rastreador llega.
 *
 * ── `lastModified` es una fecha ESCRITA, no la del build ────────────────────
 * Era `new Date()`, así que las dieciséis direcciones compartían la fecha del
 * despliegue y todas cambiaban a la vez cada vez que se subía cualquier cosa —
 * un cambio de dependencia incluido. Un mapa que dice que todo cambió ayer deja
 * de ser una señal, y el rastreador aprende a ignorarlo.
 *
 * Ahora cada página lleva la suya, movida A MANO cuando cambia su texto. Es la
 * única forma de que la fecha signifique algo: nada en el repositorio sabe
 * distinguir «se editó el copy de precios» de «se subió una versión de Next». La
 * de los tres documentos legales sale de `VERSION_LEGAL`, que ya es exactamente
 * esa fecha y ya se sube cuando el texto cambia.
 */

/** Qué páginas entran, con cuánta prioridad y de cuándo es su texto. */
const PAGINAS: {
  clave: ClaveRuta
  prioridad: number
  frecuencia: "weekly" | "monthly" | "yearly"
  /** `AAAA-MM-DD`. Se mueve al editar el texto de esa página, no al desplegar. */
  actualizada: string
}[] = [
  { clave: "inicio", prioridad: 1, frecuencia: "weekly", actualizada: "2026-09-01" },
  { clave: "producto", prioridad: 0.8, frecuencia: "monthly", actualizada: "2026-09-01" },
  { clave: "vistaPrevia", prioridad: 0.8, frecuencia: "monthly", actualizada: "2026-09-01" },
  { clave: "precios", prioridad: 0.9, frecuencia: "weekly", actualizada: "2026-09-01" },
  { clave: "preguntas", prioridad: 0.7, frecuencia: "monthly", actualizada: "2026-09-01" },
  // Existen para encontrarse cuando se buscan, no para traer visitas. Su fecha
  // es la del corpus legal: es el mismo dato con otro nombre.
  { clave: "terminos", prioridad: 0.3, frecuencia: "yearly", actualizada: VERSION_LEGAL },
  { clave: "privacidad", prioridad: 0.3, frecuencia: "yearly", actualizada: VERSION_LEGAL },
  { clave: "cookies", prioridad: 0.3, frecuencia: "yearly", actualizada: VERSION_LEGAL },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Sin dominio configurado no hay mapa: una URL relativa no la resuelve ningún
  // rastreador, y una a `localhost` es peor que ninguna.
  if (!urlAbsoluta("/")) return []

  return PAGINAS.flatMap(({ clave, prioridad, frecuencia, actualizada }) => {
    const enCadaIdioma = Object.fromEntries(
      routing.locales.map((idioma) => [
        etiquetaHtml[idioma],
        urlAbsoluta(getPathname({ href: rutas[clave], locale: idioma }))!,
      ])
    )

    return routing.locales.map((idioma) => {
      return {
        url: urlAbsoluta(getPathname({ href: rutas[clave], locale: idioma }))!,
        lastModified: new Date(`${actualizada}T00:00:00Z`),
        changeFrequency: frecuencia,
        priority: prioridad,
        alternates: {
          languages: {
            ...enCadaIdioma,
            "x-default": enCadaIdioma[etiquetaHtml[routing.defaultLocale]],
          },
        },
      }
    })
  })
}
