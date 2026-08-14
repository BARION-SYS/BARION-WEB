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
   * **La exclusión es por FORMA, no por lista.** `.*\..*` deja fuera cualquier
   * cosa con extensión, que es lo que distingue un archivo de una ruta. Con una
   * lista de nombres se escapa siempre alguno: aquí se escaparon los logotipos
   * de marca, que viven en la raíz de `public/` y no bajo `assets/`. El
   * optimizador de imágenes los pedía, recibía una redirección a
   * `/es/barion-logo-light.webp` —que no existe— y fallaba en cada carga.
   *
   * Con esta forma quedan cubiertos de una vez los logotipos, los iconos,
   * `sitemap.xml`, `robots.txt` y `llms.txt`. Estos tres, además, son del sitio
   * entero y no de una de sus versiones: un rastreador que pidiera
   * `/robots.txt` y recibiera una redirección se quedaría sin poder leerlo.
   *
   * `api/` va aparte porque no tiene extensión: es la ruta que el navegador
   * llama para pedir los planes, y sin excluirla acabaría redirigida a
   * `/es/api/planes` — el fallo saldría como una tabla de precios en blanco.
   */
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
}
