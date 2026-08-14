import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "@/i18n/routing"

/**
 * Qué mensajes se sirven en esta petición.
 *
 * Lo llama next-intl una vez por petición, antes de renderizar nada, y de ahí
 * salen tanto `useTranslations()` del servidor como los mensajes que recibe el
 * proveedor del cliente.
 *
 * ── El `import()` dinámico no es pereza ─────────────────────────────────────
 * Es lo que hace que una petición cargue **solo su idioma**. Con los dos
 * importados estáticamente, el bundle del servidor llevaría siempre los dos y
 * añadir un tercer idioma engordaría todas las respuestas, también las de quien
 * nunca lo va a leer.
 *
 * ── Un idioma desconocido cae al de referencia ──────────────────────────────
 * `hasLocale` lo comprueba porque `requestLocale` viene del segmento de la URL y
 * el segmento lo escribe quien teclea. Que la página responda 404 lo decide el
 * layout; aquí lo único que hace falta es no intentar cargar
 * `messages/xx.json` y reventar la petición entera.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const solicitado = await requestLocale
  const locale = hasLocale(routing.locales, solicitado) ? solicitado : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
