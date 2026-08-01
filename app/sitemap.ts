import type { MetadataRoute } from "next"
import { rutas } from "@/config/rutas"
import { urlAbsoluta } from "@/lib/seo"

/**
 * `/sitemap.xml`.
 *
 * Una sola dirección, porque el sitio es una sola página: las secciones son
 * anclas del mismo documento y un ancla NO es una URL que indexar — declararla
 * aparte crea contenido duplicado consigo mismo. Cuando existan páginas de
 * verdad (comparativas, casos, ayuda), se añaden aquí y en `config/rutas.ts`.
 *
 * `lastModified` es la fecha del build, que es cuando el contenido pudo
 * cambiar de verdad: los textos son constantes del repositorio, así que no se
 * mueven entre despliegues.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const inicio = urlAbsoluta(rutas.inicio)
  if (!inicio) return []

  return [
    {
      url: inicio,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
