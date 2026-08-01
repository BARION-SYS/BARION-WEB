import type { MetadataRoute } from "next"
import { rutasMaquina } from "@/config/rutas"
import { urlAbsoluta } from "@/lib/seo"

/**
 * `/robots.txt`.
 *
 * Todo abierto, y a propósito: este sitio existe para ser indexado. Lo que hay
 * detrás de sesión —panel, escaparate, registro— vive en OTRO dominio (repo
 * `BARION-FRONT`) y se cierra en el `robots.txt` de aquel, no en este; poner
 * aquí un `Disallow` de rutas que no son de este dominio no cierra nada.
 *
 * Tampoco se excluye a los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot
 * y compañía). Barion vende software, no publica contenido que alguien pueda
 * revender: que un asistente sepa responder «qué es Barion» es distribución
 * gratis. Para eso está `/llms.txt`, que les da la versión buena.
 */
export default function robots(): MetadataRoute.Robots {
  const mapa = urlAbsoluta(rutasMaquina.sitemap)

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    // Sin dominio configurado no se declara mapa: una URL relativa aquí no la
    // resuelve ningún rastreador, y una a `localhost` es peor que ninguna.
    ...(mapa ? { sitemap: mapa } : {}),
  }
}
