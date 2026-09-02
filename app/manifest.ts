import type { MetadataRoute } from "next"
import { getTranslations } from "next-intl/server"
import { etiquetaHtml } from "@/config/idiomas"
import { NOMBRE_SITIO } from "@/config/sitio"
import { routing } from "@/i18n/routing"

/**
 * `/manifest.webmanifest`.
 *
 * ── Qué es y qué NO es ──────────────────────────────────────────────────────
 * No convierte este sitio en una aplicación instalable, y no se pretende: la
 * aplicación de Barion es otro despliegue en otro dominio (`BARION-FRONT`) y es
 * ella la que se instala. Esto es la ficha de identidad del SITIO — nombre,
 * colores e iconos— que el navegador usa al guardar un acceso directo y que
 * cualquier herramienta de auditoría busca lo primero. Faltaba: la dirección
 * respondía 404.
 *
 * ── En el idioma de referencia, y a propósito ───────────────────────────────
 * El manifiesto es UNO para todo el dominio, sin idioma en la dirección, igual
 * que `/llms.txt`. Publicar uno por idioma exigiría un `<link rel="manifest">`
 * distinto por página y una convención propia que ningún navegador busca. Lo que
 * se traduce del sistema es lo que se lee dentro de la página.
 *
 * ── `start_url` lleva idioma ────────────────────────────────────────────────
 * `/` no es una página: es la decisión que resuelve `proxy.ts` con una
 * redirección. Un acceso directo que apunta ahí arranca con un salto de más.
 *
 * Los colores son los mismos `--background` de `globals.css` que ya usa
 * `viewport`; el tema oscuro es el de referencia porque es el que se pinta
 * mientras no se conoce la preferencia.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const idioma = routing.defaultLocale
  const t = await getTranslations({ locale: idioma, namespace: "identidad" })

  return {
    name: t("tituloInicio"),
    short_name: NOMBRE_SITIO,
    description: t("descripcionCorta"),
    lang: etiquetaHtml[idioma],
    start_url: `/${idioma}`,
    scope: "/",
    display: "browser",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      { src: "/icono-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icono-512.png", sizes: "512x512", type: "image/png" },
      // `maskable` es el que Android recorta a la forma del sistema sin comerse
      // el logotipo. Es el mismo archivo con el margen ya dentro.
      { src: "/icono-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
