import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Cierre } from "@/components/sections/Cierre"
import { ValorList } from "@/components/sections/ValorList"
import { routing } from "@/i18n/routing"
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

  const t = await getTranslations({ locale: idioma, namespace: "paginas.producto" })
  return {
    title: t("titulo"),
    description: t("descripcion"),
    alternates: alternativas(idioma, "producto"),
  }
}

/**
 * Qué hace Barion, entero: los tres bloques CON su detalle y las siete
 * capacidades — que es justo lo que la portada no enseña.
 *
 * El cierre se repite al final de cada sección a propósito: quien termina de
 * leer una página completa está en el momento de decidir, y mandarlo de vuelta a
 * la portada a buscar el botón es perderlo por el camino.
 */
export default async function ProductoPage({ params }: Props) {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) notFound()
  setRequestLocale(idioma)

  return (
    <>
      {/* `pt` grande: la cabecera es fija y aquí no hay hero que reserve su
          altura, así que sin esto el titular nacería debajo de la barra. */}
      <div className="pt-20 lg:pt-24">
        <ValorList nivel="h1" />
      </div>
      <Cierre tono="base" />
    </>
  )
}
