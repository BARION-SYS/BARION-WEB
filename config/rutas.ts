import { envPublico } from "@/config/env.public"

/**
 * Fuente única de los destinos del sitio. Un CTA que apunta a una ruta
 * inexistente manda al 404 y se lee como un sitio roto; el único modo de
 * evitarlo es tener un sitio donde mirarlos todos juntos.
 */
export const rutas = {
  inicio: "/",
} as const

/** Anclas de las secciones de la página. Son ids reales del DOM. */
export const anclas = {
  producto: "#producto",
  vistaPrevia: "#vista-previa",
  precios: "#precios",
  preguntas: "#preguntas",
} as const

/**
 * Rutas que no pinta React: las genera Next desde `app/robots.ts`,
 * `app/sitemap.ts` y `app/llms.txt/route.ts`. Viven aquí porque se referencian
 * entre ellas —el `robots.txt` declara el mapa— y porque una dirección de este
 * sitio escrita a mano en dos archivos se desincroniza igual sea o no HTML.
 */
export const rutasMaquina = {
  sitemap: "/sitemap.xml",
  robots: "/robots.txt",
  /** El sitio en texto plano, para modelos de lenguaje. */
  llms: "/llms.txt",
} as const

/**
 * Entrar y registrarse NO viven aquí: son de la aplicación (repo BARION-FRONT),
 * que es otro despliegue en otro dominio. Por eso son URLs absolutas y se
 * navegan con `<a>` y no con `next/link` — no hay ruta de este sitio que
 * prefetchear, y el Link de Next sobre un origen ajeno solo añade ruido.
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
