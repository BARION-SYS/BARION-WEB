import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { DatosEstructurados } from "@/components/common/DatosEstructurados"
import { Cierre } from "@/components/sections/Cierre"
import { PreciosList } from "@/components/sections/PreciosList"
import { PreguntasFrecuentes } from "@/components/sections/PreguntasFrecuentes"
import { rutas } from "@/config/rutas"
import { routing } from "@/i18n/routing"
import { regionDeLaPeticion } from "@/lib/region"
import { grafoAplicacion, grafoPagina, metadatosDePagina } from "@/lib/seo"
import { obtenerPaisesOperados } from "@/services/paises"
import { obtenerPlanesPublicos } from "@/services/planes"

interface Props {
  params: Promise<{ idioma: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) return {}

  return metadatosDePagina(idioma, "precios")
}

/**
 * Los planes, con el selector de país y lo que trae cualquiera de ellos.
 *
 * **El JSON-LD de las ofertas se declara AQUÍ y también en la portada**, y no es
 * duplicado: son dos direcciones que enseñan precios de verdad. Lo que no se
 * repite es el `FAQPage`, que solo vive donde están todas las preguntas.
 */
export default async function PreciosPage({ params }: Props) {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) notFound()
  setRequestLocale(idioma)

  const [cookiesPeticion, cabeceras, planes, paises] = await Promise.all([
    cookies(),
    headers(),
    obtenerPlanesPublicos(),
    obtenerPaisesOperados(),
  ])

  const t = await getTranslations({ locale: idioma, namespace: "preguntas" })
  const { region, operados } = regionDeLaPeticion(cookiesPeticion, cabeceras, paises)

  return (
    <>
      <DatosEstructurados datos={await grafoPagina(idioma, "precios")} />
      <DatosEstructurados datos={await grafoAplicacion(idioma, planes, operados)} />

      <div className="pt-20 lg:pt-24">
        <PreciosList planes={planes} region={region} operados={operados} nivel="h1" />
      </div>

      {/* Las preguntas de dinero, justo debajo del precio: es donde aparecen. */}
      <PreguntasFrecuentes limite={6} enlace={{ href: rutas.preguntas, texto: t("verTodo") }} />
      <Cierre />
    </>
  )
}
