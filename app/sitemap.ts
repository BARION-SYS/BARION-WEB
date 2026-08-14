import type { MetadataRoute } from "next"
import { etiquetaHtml } from "@/config/idiomas"
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
 * `lastModified` es la fecha del build, que es cuando el contenido pudo cambiar
 * de verdad: los textos son constantes del repositorio, así que no se mueven
 * entre despliegues.
 */

/** Qué páginas entran y con cuánta prioridad. La portada primero. */
const PAGINAS: {
  clave: ClaveRuta
  prioridad: number
  frecuencia: "weekly" | "monthly" | "yearly"
}[] = [
  { clave: "inicio", prioridad: 1, frecuencia: "weekly" },
  { clave: "producto", prioridad: 0.8, frecuencia: "monthly" },
  { clave: "vistaPrevia", prioridad: 0.8, frecuencia: "monthly" },
  { clave: "precios", prioridad: 0.9, frecuencia: "weekly" },
  { clave: "preguntas", prioridad: 0.7, frecuencia: "monthly" },
  // Existen para encontrarse cuando se buscan, no para traer visitas.
  { clave: "terminos", prioridad: 0.3, frecuencia: "yearly" },
  { clave: "privacidad", prioridad: 0.3, frecuencia: "yearly" },
  { clave: "cookies", prioridad: 0.3, frecuencia: "yearly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Sin dominio configurado no hay mapa: una URL relativa no la resuelve ningún
  // rastreador, y una a `localhost` es peor que ninguna.
  if (!urlAbsoluta("/")) return []

  const ahora = new Date()

  return PAGINAS.flatMap(({ clave, prioridad, frecuencia }) => {
    const enCadaIdioma = Object.fromEntries(
      routing.locales.map((idioma) => [
        etiquetaHtml[idioma],
        urlAbsoluta(getPathname({ href: rutas[clave], locale: idioma }))!,
      ])
    )

    return routing.locales.map((idioma) => {
      return {
        url: urlAbsoluta(getPathname({ href: rutas[clave], locale: idioma }))!,
        lastModified: ahora,
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
