import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { DocumentoLegal } from "@/components/legal/DocumentoLegal"
import { VERSION_LEGAL } from "@/config/legal"
import { routing } from "@/i18n/routing"
import { IDIOMA_DE_LOS_DOCUMENTOS, documentoLegal } from "@/lib/legal"
import { alternativas } from "@/lib/seo"

interface Props {
  params: Promise<{ idioma: string }>
}

export function generateStaticParams() {
  return routing.locales.map((idioma) => ({ idioma }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) return {}

  const t = await getTranslations({ locale: idioma, namespace: "paginas.cookies" })
  return {
    title: t("titulo"),
    description: t("descripcion"),
    alternates: alternativas(idioma, "cookies"),
    other: { "document-version": VERSION_LEGAL },
  }
}

/**
 * Se indexa, y a propósito. Un documento legal escondido detrás de un `noindex`
 * es un documento que nadie puede comprobar antes de contratar; que exista y se
 * encuentre es parte de lo que hace creíble a un producto que cobra.
 */
export default async function CookiesPage({ params }: Props) {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) notFound()
  setRequestLocale(idioma)

  const t = await getTranslations({ locale: idioma, namespace: "legal" })

  return (
    <DocumentoLegal
      documento={documentoLegal(idioma, "cookies")}
      clave="cookies"
      // El aviso sale solo cuando se está sirviendo un idioma al que el
      // documento NO está traducido: dice cuál es la versión que rige. La
      // condición es el idioma, no que exista la clave — la clave existe en los
      // dos para el día que el original se escriba en otro.
      avisoIdioma={idioma === IDIOMA_DE_LOS_DOCUMENTOS ? null : t("avisoTraduccion")}
    />
  )
}
