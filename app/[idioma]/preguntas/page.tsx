import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { DatosEstructurados } from "@/components/common/DatosEstructurados"
import { Cierre } from "@/components/sections/Cierre"
import { PreguntasFrecuentes } from "@/components/sections/PreguntasFrecuentes"
import { routing } from "@/i18n/routing"
import { grafoPagina, grafoPreguntas, metadatosDePagina } from "@/lib/seo"

interface Props {
  params: Promise<{ idioma: string }>
}

export function generateStaticParams() {
  return routing.locales.map((idioma) => ({ idioma }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) return {}

  return metadatosDePagina(idioma, "preguntas")
}

/**
 * Todas las preguntas, agrupadas — y el único sitio donde se declara el
 * `FAQPage`.
 *
 * Ese dato estructurado afirma «esta dirección responde estas preguntas», así
 * que solo puede ir donde estén todas. Declararlo en la portada, que enseña
 * cinco de dieciocho, sería prometer lo que esa página no da.
 */
export default async function PreguntasPage({ params }: Props) {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) notFound()
  setRequestLocale(idioma)

  return (
    <>
      <DatosEstructurados datos={await grafoPagina(idioma, "preguntas")} />
      <DatosEstructurados datos={await grafoPreguntas(idioma)} />
      <div className="pt-20 lg:pt-24">
        <PreguntasFrecuentes nivel="h1" tono="base" />
      </div>
      <Cierre tono="base" />
    </>
  )
}
