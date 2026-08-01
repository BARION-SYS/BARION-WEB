import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { DatosEstructurados } from "@/components/common/DatosEstructurados"
import { Footer } from "@/components/layout/Footer"
import { Nav } from "@/components/layout/Nav"
import { MotionProvider } from "@/components/providers/MotionProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { envPublico } from "@/config/env.public"
import {
  DESCRIPCION,
  DESCRIPCION_CORTA,
  IMAGEN_SOCIAL,
  LOCALE_OG,
  NOMBRE_SITIO,
  PALABRAS_CLAVE,
  PLANTILLA_TITULO,
  TITULO_INICIO,
} from "@/config/sitio"
import { grafoSitio } from "@/lib/seo"

const inter = Inter({ subsets: ["latin"] })

/**
 * Este sitio es UNA superficie: todo lo que se sirve desde aquí es público y
 * lleva la misma cabecera y el mismo pie. Por eso Nav y Footer viven en el
 * layout raíz y no en un grupo de rutas — el 404 también los hereda, y una
 * dirección equivocada deja al visitante DENTRO del sitio en vez de en una
 * pantalla en blanco con dos palabras.
 *
 * No monta nada de tenant: esta página no pertenece a ninguna barbería, así que
 * usa siempre los colores por defecto de `globals.css`. Los colores de marca son
 * del panel y del escaparate, que viven en la aplicación (repo BARION-FRONT).
 *
 * DOS AUSENCIAS DELIBERADAS en la metadata de abajo:
 *
 *  · **`icons`.** Los iconos son `app/favicon.ico` y `app/apple-icon.png`, que
 *    Next detecta por convención de archivo y publica él mismo; declararlos
 *    además aquí duplica los `<link>`. Y en ICO/PNG, no en webp: un favicon
 *    webp no lo pinta Safari ni lo acepta Google para el icono del resultado.
 *  · **`alternates`.** Next NO fusiona ese objeto con el de la página: lo
 *    sustituye entero. Con la canónica declarada en `app/page.tsx`, cualquier
 *    `alternates` de aquí desaparecería justo en la portada. Los dos —canónica
 *    y `/llms.txt`— viven juntos allí.
 */
export const metadata: Metadata = {
  // Sin dirección pública configurada Next resuelve la imagen social contra
  // localhost: mejor no declararla que declararla rota.
  metadataBase: envPublico.siteUrl ? new URL(envPublico.siteUrl) : undefined,
  // El título de la portada lo fija ella misma; la plantilla es para lo que
  // venga después (comparativas, ayuda) y para el 404.
  title: { default: TITULO_INICIO, template: PLANTILLA_TITULO },
  description: DESCRIPCION,
  applicationName: NOMBRE_SITIO,
  keywords: PALABRAS_CLAVE,
  authors: [{ name: NOMBRE_SITIO }],
  creator: NOMBRE_SITIO,
  publisher: NOMBRE_SITIO,
  category: "business",
  /**
   * `max-image-preview: large` es lo que decide que la sala del hero salga en
   * grande en el resultado, y no como una miniatura de la que no se entiende
   * nada. `max-snippet: -1` deja que el buscador use el fragmento que quiera:
   * recortarlo solo sirve para que la respuesta llegue a medias.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Números de teléfono en el marcado de ejemplo del panel: sin esto Safari
  // los convierte en enlaces telefónicos y rompe el diseño de la maqueta.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: NOMBRE_SITIO,
    locale: LOCALE_OG,
    url: envPublico.siteUrl,
    title: TITULO_INICIO,
    description: DESCRIPCION,
    images: [IMAGEN_SOCIAL],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_INICIO,
    description: DESCRIPCION_CORTA,
    images: [IMAGEN_SOCIAL.url],
  },
}

/**
 * Un color por tema, no uno solo. Con un único `themeColor` la barra del
 * navegador móvil se queda negra sobre una página clara — el sitio se ve
 * partido en dos justo en el borde superior, que es lo primero que se mira.
 * Los valores son los mismos `--background` de `globals.css`.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "light dark",
}

// El tema lo controla next-themes (clase en <html>); los tokens viven en app/globals.css.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className="bg-background"
      style={{ fontFamily: inter.style.fontFamily }}
    >
      <body className="font-sans antialiased">
        {/* Quién publica y qué sitio es esto. Va en el layout porque vale para
            toda página servida desde aquí, el 404 incluido. Lo del producto y
            los precios lo añade `app/page.tsx`. */}
        <DatosEstructurados datos={grafoSitio()} />
        <ThemeProvider>
          {/* Un único MotionConfig para todo el árbol — no anidar otro dentro. */}
          <MotionProvider>
            <a
              href="#contenido"
              className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
            >
              Saltar al contenido
            </a>
            <Nav />
            <main id="contenido">{children}</main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
