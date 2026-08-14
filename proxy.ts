import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

/**
 * Quien llega sin decir idioma acaba en uno.
 *
 * Lo resuelve el middleware de next-intl a partir de `routing`: negocia con la
 * cookie y con `Accept-Language`, redirige conservando la ruta entera y recuerda
 * la elección. Antes esto eran cuarenta líneas escritas a mano que hacían lo
 * mismo peor — sin `Vary`, sin normalizar cabeceras raras y con la cookie
 * escrita desde dos sitios.
 *
 * ── Lo que NO se puede perder al tocar esto ─────────────────────────────────
 * Que redirija **cualquier** ruta sin prefijo, no solo `/`. La aplicación enlaza
 * a `/legal/terminos` desde la casilla del alta, y ese enlace está compilado
 * dentro de otro despliegue: reestructurar este sitio no puede romperlo.
 * `localePrefix: "always"` es lo que lo garantiza.
 *
 * Se llama `proxy.ts` y no `middleware.ts` porque es como Next 16 nombra esta
 * convención; con el nombre viejo el build avisa en cada corrida.
 */
export default createMiddleware(routing)

export const config = {
  /**
   * Todo menos lo que no es una página.
   *
   * `sitemap.xml`, `robots.txt` y `llms.txt` se quedan fuera **a propósito**:
   * son del sitio entero y no de una de sus versiones, y un rastreador que
   * pidiera `/robots.txt` y recibiera una redirección a `/es/robots.txt` —que no
   * existe— se quedaría sin poder leerlo.
   *
   * `api/` también, y esa es la que de verdad rompe algo: es la ruta que el
   * navegador llama para pedir los planes. Sin excluirla acabaría redirigida a
   * `/es/api/planes`, y el fallo saldría como una tabla de precios en blanco.
   */
  matcher: [
    "/((?!api/|_next/static|_next/image|assets/|favicon.ico|apple-icon.png|sitemap.xml|robots.txt|llms.txt).*)",
  ],
}
