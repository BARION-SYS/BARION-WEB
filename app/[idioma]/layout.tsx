import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import "../globals.css"
import { DatosEstructurados } from "@/components/common/DatosEstructurados"
import { Footer } from "@/components/layout/Footer"
import { Nav } from "@/components/layout/Nav"
import { MotionProvider } from "@/components/providers/MotionProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { envPublico } from "@/config/env.public"
import { etiquetaHtml, localeSocial, type Idioma } from "@/config/idiomas"
import { IMAGEN_SOCIAL, NOMBRE_SITIO } from "@/config/sitio"
import { mensajesDelCliente } from "@/i18n/cliente"
import { routing } from "@/i18n/routing"
import { grafoSitio } from "@/lib/seo"

const inter = Inter({ subsets: ["latin"] })

/**
 * ESTE es el layout raíz del sitio, y por eso vive dentro de `[idioma]`.
 *
 * No hay `app/layout.tsx`: el `<html lang>` tiene que decir en qué idioma está
 * la página, y eso solo se sabe leyendo el segmento. Un layout raíz por encima
 * obligaría a fijar un `lang` antes de conocerlo, que es exactamente la mentira
 * que se quería evitar — `lang` es lo que usa un lector de pantalla para elegir
 * voz, así que un valor equivocado no es un detalle de metadatos.
 *
 * Todo lo que se sirve desde aquí es público y lleva la misma cabecera y el
 * mismo pie. Por eso Nav y Footer viven aquí y no en un grupo de rutas: el 404
 * también los hereda, y una dirección equivocada deja al visitante DENTRO del
 * sitio en vez de en una pantalla en blanco con dos palabras.
 */

/** Los dos idiomas se prerrenderizan. No hay tercero que negociar en ejecución. */
export function generateStaticParams() {
  return routing.locales.map((idioma) => ({ idioma }))
}

interface ParamsIdioma {
  params: Promise<{ idioma: string }>
}

export async function generateMetadata({ params }: ParamsIdioma): Promise<Metadata> {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) return {}

  const t = await getTranslations({ locale: idioma, namespace: "identidad" })

  return {
    // Sin dirección pública configurada Next resuelve la imagen social contra
    // localhost: mejor no declararla que declararla rota.
    metadataBase: envPublico.siteUrl ? new URL(envPublico.siteUrl) : undefined,
    // El título de cada página lo fija ella misma; la plantilla es el marco.
    title: { default: t("tituloInicio"), template: t("plantillaTitulo") },
    description: t("descripcion"),
    applicationName: NOMBRE_SITIO,
    keywords: t.raw("palabrasClave") as string[],
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
      locale: localeSocial[idioma],
      url: `/${idioma}`,
      title: t("tituloInicio"),
      description: t("descripcion"),
      images: [{ ...IMAGEN_SOCIAL, alt: t("altImagenSocial") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("tituloInicio"),
      description: t("descripcionCorta"),
      images: [IMAGEN_SOCIAL.url],
    },
    // DOS AUSENCIAS DELIBERADAS:
    //  · `icons` — son `app/favicon.ico` y `app/apple-icon.png`, que Next
    //    detecta por convención de archivo; declararlos aquí duplica los `<link>`.
    //  · `alternates` — Next lo SUSTITUYE entero en cada página, no lo fusiona,
    //    así que uno declarado aquí desaparecería justo donde importa. Canónica
    //    y `hreflang` los declara cada página con `alternativas()`.
  }
}

/**
 * Un color por tema, no uno solo. Con un único `themeColor` la barra del
 * navegador móvil se queda negra sobre una página clara — el sitio se ve partido
 * en dos justo en el borde superior, que es lo primero que se mira. Los valores
 * son los mismos `--background` de `globals.css`.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "light dark",
}

export default async function LayoutRaiz({
  children,
  params,
}: Readonly<{ children: React.ReactNode }> & ParamsIdioma) {
  const { idioma } = await params
  // `/xx/precios` responde 404 en vez de servir el contenido por defecto bajo
  // una dirección inventada: si respondiera 200, cada error de tecleo sería una
  // URL indexable más con el mismo contenido.
  if (!hasLocale(routing.locales, idioma)) notFound()

  // Sin esto, cualquier página que use `useTranslations` se vuelve dinámica: es
  // lo que le dice a next-intl qué idioma se está renderizando cuando NO hay
  // petición, que es justo el caso de la generación estática.
  setRequestLocale(idioma)

  return (
    <html
      lang={etiquetaHtml[idioma]}
      suppressHydrationWarning
      className="bg-background"
      style={{ fontFamily: inter.style.fontFamily }}
    >
      <body className="font-sans antialiased">
        {/* Quién publica y qué sitio es esto. Va en el layout porque vale para
            toda página servida desde aquí, el 404 incluido. */}
        <DatosEstructurados datos={await grafoSitio(idioma)} />
        {/*
         * El proveedor baja los mensajes a los componentes cliente. Es lo que
         * sustituyó a pasar el diccionario por props — y de paso cerró la clase
         * de fallo que daba: una prop con una función dentro no se puede
         * serializar hacia un componente cliente, y el diccionario tenía nueve.
         *
         * Baja SOLO los espacios que el cliente usa (`i18n/cliente.ts`): el
         * resto se resuelve en el servidor y mandarlo sería texto viajando para
         * nada, en un sitio cuyo argumento es lo rápido que pinta.
         */}
        <NextIntlClientProvider messages={await mensajesDelCliente(idioma)}>
          <ThemeProvider>
            {/* Un único MotionConfig para todo el árbol — no anidar otro dentro. */}
            <MotionProvider>
              <EnlaceSaltar idioma={idioma} />
              <Nav />
              <main id="contenido">{children}</main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

/** Lo primero que encuentra quien navega con teclado, y lo único que va antes del nav. */
async function EnlaceSaltar({ idioma }: { idioma: Idioma }) {
  const t = await getTranslations({ locale: idioma, namespace: "navegacion" })
  return (
    <a
      href="#contenido"
      className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
    >
      {t("saltarAlContenido")}
    </a>
  )
}
