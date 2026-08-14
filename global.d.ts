import type messages from "@/messages/es.json"
import type { routing } from "@/i18n/routing"

/**
 * Tipos de next-intl para ESTE proyecto.
 *
 * ── Qué recupera ───────────────────────────────────────────────────────────
 * Al pasar los diccionarios de TypeScript a JSON se perdía la garantía que más
 * valía: que una clave inexistente no compilara. Esto la devuelve — `t()` acepta
 * solo claves que existan en `messages/es.json`, y `useLocale()` devuelve el
 * tipo de los idiomas declarados en `routing`, no `string`.
 *
 * ── Qué NO cubre, y por eso existe `i18n/completitud.ts` ───────────────────
 * Esto tipa contra el ESPAÑOL, que es el base. Que el inglés esté completo es
 * otra afirmación y se comprueba aparte: sin ella, una clave sin traducir
 * compila igual y la página le habla en español a quien no lo entiende — el
 * único fallo de idioma que no se ve al probar.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
