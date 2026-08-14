import { routing, type Idioma } from "@/i18n/routing"

/**
 * Lo que hay que saber de cada idioma y que NO es configuración de rutas.
 *
 * Los idiomas, el de referencia y cómo se negocian viven en `i18n/routing.ts`,
 * que es de donde tiran next-intl y el proxy. Aquí solo queda lo que ese objeto
 * no puede saber: cómo se llama cada idioma y con qué etiquetas se declara en el
 * HTML y en la tarjeta social.
 *
 * Se declaran como `Record<Idioma, …>` a propósito: **añadir un idioma en
 * `routing` y olvidarse de estas tres tablas no compila**, que es exactamente lo
 * que se quiere — un idioma sin nombre no se puede ofrecer en el selector, y uno
 * sin `lang` publica una página que le miente a un lector de pantalla.
 */

/** Cómo se llama cada uno EN SÍ MISMO: un selector nunca traduce sus opciones. */
export const nombresDeIdioma: Record<Idioma, string> = {
  es: "Español",
  en: "English",
}

/**
 * El `lang` del `<html>`. No es decoración: es lo que usa un lector de pantalla
 * para elegir voz y lo que le dice a un buscador en qué idioma está el texto.
 */
export const etiquetaHtml: Record<Idioma, string> = {
  es: "es",
  en: "en",
}

/**
 * El `locale` de la tarjeta social, que sí lleva región porque Open Graph la
 * pide. Se elige el mercado de referencia de cada idioma.
 */
export const localeSocial: Record<Idioma, string> = {
  es: "es_CO",
  en: "en_US",
}

/** Reexportado para que nadie tenga que saber que el tipo nace en `routing`. */
export type { Idioma }
export const IDIOMAS = routing.locales
export const IDIOMA_DEFECTO = routing.defaultLocale
