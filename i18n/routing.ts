import { defineRouting } from "next-intl/routing"

/**
 * La configuración de idiomas del sitio. **Un solo sitio.**
 *
 * De aquí salen las tres cosas que antes vivían separadas y podían discrepar:
 * qué idiomas hay, cuál es el de referencia y cómo se reparte a quien llega sin
 * decirlo. El proxy, la navegación y la resolución de mensajes se construyen
 * todos a partir de este objeto, así que añadir un idioma es tocar esta lista.
 *
 * ── `localePrefix: "always"` ────────────────────────────────────────────────
 * Todos llevan prefijo, también el español. Sin él, `/precios` significaría dos
 * cosas —la página, y «la versión española de la página»—; con prefijo, cada URL
 * dice qué es y `/` no es una página sino una decisión.
 *
 * ── `localeCookie` ─────────────────────────────────────────────────────────
 * Es la memoria de la elección, y la escribe el middleware al ver la dirección
 * pedida. El servidor la lee para decidir a dónde mandar a quien entra por `/`.
 * **El store del navegador la refleja, no la sustituye** (`store/idioma.store.ts`):
 * `localStorage` no lo ve el servidor, así que una preferencia que viviera solo
 * ahí no podría decidir nada antes del primer render.
 */
/**
 * El nombre de la cookie del idioma. Se declara aparte porque lo usan DOS: el
 * middleware, que la escribe al ver la dirección pedida, y el store, que la
 * refleja al elegir. Dos literales sueltos serían dos preferencias.
 */
export const COOKIE_IDIOMA = "barion_idioma"

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  localeCookie: {
    name: COOKIE_IDIOMA,
    // Una preferencia, no una sesión.
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  },
})

export type Idioma = (typeof routing.locales)[number]
