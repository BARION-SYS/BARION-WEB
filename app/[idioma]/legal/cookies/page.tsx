import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { DatosEstructurados } from "@/components/common/DatosEstructurados"
import { DocumentoLegal } from "@/components/legal/DocumentoLegal"
import { VERSION_LEGAL } from "@/config/legal"
import { routing } from "@/i18n/routing"
import { IDIOMA_DE_LOS_DOCUMENTOS, documentoLegal } from "@/lib/legal"
import { grafoPagina, metadatosDePagina } from "@/lib/seo"

interface Props {
  params: Promise<{ idioma: string }>
}

export function generateStaticParams() {
  return routing.locales.map((idioma) => ({ idioma }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) return {}

  return {
    ...(await metadatosDePagina(idioma, "cookies")),
    // La versión del corpus legal, para que un rastreador —y quien audite— vea
    // qué texto se está sirviendo sin abrir la página.
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
    <>
      {/* La ruta por la que se llega. El escalón «Legal» se pinta arriba pero
          NO entra en el grafo — agrupa tres documentos y no es ninguno, así que
          no tiene dirección a la que llevar. */}
      <DatosEstructurados datos={await grafoPagina(idioma, "cookies", [{ texto: t("titulo") }])} />
      <DocumentoLegal
        documento={documentoLegal(idioma, "cookies")}
        clave="cookies"
        // El aviso sale solo cuando se está sirviendo un idioma al que el
        // documento NO está traducido: dice cuál es la versión que rige. La
        // condición es el idioma, no que exista la clave — la clave existe en los
        // dos para el día que el original se escriba en otro.
        avisoIdioma={idioma === IDIOMA_DE_LOS_DOCUMENTOS ? null : t("avisoTraduccion")}
      />
    </>
  )
}
