import { envPublico } from "@/config/env.public"

/**
 * Fuente única de los destinos del sitio. Un CTA que apunta a una ruta
 * inexistente manda al 404 y se lee como un sitio roto; el único modo de
 * evitarlo es tener un sitio donde mirarlos todos juntos.
 *
 * ── Van SIN idioma, y eso es lo que cambió ──────────────────────────────────
 * El prefijo lo pone el `Link` de `i18n/navigation`, que conoce el idioma
 * activo: se enlaza a `/precios` y sale `/es/precios` o `/en/precios` según
 * dónde se esté. Antes las rutas eran una función del idioma y había que
 * acordarse de pasárselo en cada uso — ese es exactamente el sitio donde un día
 * falta y el enlace devuelve a alguien al español a mitad de la navegación.
 *
 * Para construir direcciones ABSOLUTAS de otro idioma —la canónica, el
 * `hreflang`, el sitemap— está `getPathname({ href, locale })` de
 * `i18n/navigation`, que las deriva de estas mismas.
 *
 * ── Los segmentos NO se traducen ────────────────────────────────────────────
 * `/en/precios` y no `/en/pricing`. Con rutas traducidas, cada página
 * necesitaría saber cómo se llama en los otros idiomas para poder ofrecer el
 * cambio y declarar su `hreflang`: una tabla de equivalencias más, y la primera
 * ruta que se añada sin actualizarla deja el selector de idioma llevando al 404.
 */
export const rutas = {
  inicio: "/",
  producto: "/producto",
  vistaPrevia: "/vista-previa",
  precios: "/precios",
  preguntas: "/preguntas",
  terminos: "/legal/terminos",
  privacidad: "/legal/privacidad",
  cookies: "/legal/cookies",
} as const

export type ClaveRuta = keyof typeof rutas

/**
 * Las cuatro secciones, **en el orden en que se leen**: qué hace → cómo se ve →
 * cuánto cuesta → qué se pregunta. Es el mismo argumento de venta que tenía el
 * scroll de la portada antes de partirse en páginas.
 *
 * Vive aquí y no en cada componente porque lo usan tres: la cabecera, el pie y
 * el anterior/siguiente del final de cada sección. En tres listas, la que se
 * queda con el orden viejo es siempre la que menos se abre.
 */
export const SECCIONES = ["producto", "vistaPrevia", "precios", "preguntas"] as const

export type ClaveSeccion = (typeof SECCIONES)[number]

/**
 * Rutas que no pinta React: las genera Next desde `app/robots.ts`,
 * `app/sitemap.ts` y `app/llms.txt/route.ts`. Viven aquí porque se referencian
 * entre ellas —el `robots.txt` declara el mapa— y porque una dirección de este
 * sitio escrita a mano en dos archivos se desincroniza igual sea o no HTML.
 *
 * **No llevan idioma**: son del sitio entero, no de una versión.
 */
export const rutasMaquina = {
  sitemap: "/sitemap.xml",
  robots: "/robots.txt",
  /**
   * El ÍNDICE para modelos de lenguaje: qué es Barion y en qué dirección vive
   * cada parte, como listas de enlaces — que es lo que espera la convención.
   */
  llms: "/llms.txt",
  /**
   * El sitio ENTERO en texto plano, para citar de una sola petición.
   *
   * Son dos direcciones y no una porque hacen cosas distintas: un cliente que
   * quiere saber qué páginas existen sigue el índice, y uno que va a responder
   * «¿cuánto cuesta Barion?» se lleva el completo. Un solo archivo obligaba a
   * descargarlo entero para lo primero y no cumplía la convención para lo
   * segundo.
   */
  llmsFull: "/llms-full.txt",
} as const

/**
 * Entrar y registrarse NO viven aquí: son de la aplicación (repo BARION-FRONT),
 * que es otro despliegue en otro dominio. Por eso son URLs absolutas y se
 * navegan con `<a>` y no con `next/link` — no hay ruta de este sitio que
 * prefetchear, y el Link de Next sobre un origen ajeno solo añade ruido.
 *
 * Tampoco llevan idioma: la aplicación resuelve el suyo por su cuenta.
 */
export const rutasApp = {
  entrar: `${envPublico.appUrl}/entrar`,
  registro: `${envPublico.appUrl}/registro`,
} as const

/**
 * Contacto comercial. Hasta que exista una página propia, es el canal.
 *
 * Va sobre `buildrion.com`, que es el dominio del sistema y el único verificado
 * para correo: `barion.app` no está registrado a nombre de Barion, así que lo
 * que se escribiera ahí no llegaba a ningún buzón. La dirección existe como
 * regla de Cloudflare Email Routing, no como cuenta — ver
 * `BARION-SYS/docs/CORREO-DOMINIO.md`.
 */
export const CORREO_CONTACTO = "contacto@buildrion.com"
