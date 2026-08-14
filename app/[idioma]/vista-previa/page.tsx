import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Cierre } from "@/components/sections/Cierre"
import { VistaPrevia } from "@/components/sections/VistaPrevia"
import { routing } from "@/i18n/routing"
import { regionDeLaPeticion } from "@/lib/region"
import { alternativas } from "@/lib/seo"
import { obtenerPaisesOperados } from "@/services/paises"

interface Props {
  params: Promise<{ idioma: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) return {}

  const t = await getTranslations({ locale: idioma, namespace: "paginas.vistaPrevia" })
  return {
    title: t("titulo"),
    description: t("descripcion"),
    alternates: alternativas(idioma, "vistaPrevia"),
  }
}

/**
 * El panel y el escaparate, con el escaparate JUGABLE.
 *
 * Necesita la región porque los precios de la maqueta se enseñan en la moneda de
 * quien mira: un escaparate con precios en pesos no le cuenta nada a alguien en
 * España, y convertirlos sería inventárselos. Por eso la página es dinámica.
 */
export default async function VistaPreviaPage({ params }: Props) {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) notFound()
  setRequestLocale(idioma)

  const [cookiesPeticion, cabeceras, paises] = await Promise.all([
    cookies(),
    headers(),
    obtenerPaisesOperados(),
  ])

  const { region } = regionDeLaPeticion(cookiesPeticion, cabeceras, paises)

  return (
    <>
      <div className="pt-20 lg:pt-24">
        <VistaPrevia region={region} nivel="h1" tono="base" />
      </div>
      <Cierre tono="base" />
    </>
  )
}
