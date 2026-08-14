import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { DatosEstructurados } from "@/components/common/DatosEstructurados"
import { Cierre } from "@/components/sections/Cierre"
import { Hero } from "@/components/sections/Hero"
import { PreciosList } from "@/components/sections/PreciosList"
import { PreguntasFrecuentes } from "@/components/sections/PreguntasFrecuentes"
import { ValorList } from "@/components/sections/ValorList"
import { VistaPrevia } from "@/components/sections/VistaPrevia"
import { rutas } from "@/config/rutas"
import { routing } from "@/i18n/routing"
import { regionDeLaPeticion } from "@/lib/region"
import { alternativas, grafoAplicacion } from "@/lib/seo"
import { obtenerPaisesOperados } from "@/services/paises"
import { obtenerPlanesPublicos } from "@/services/planes"

interface Props {
  params: Promise<{ idioma: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) return {}

  const t = await getTranslations({ locale: idioma, namespace: "paginas.inicio" })
  return {
    title: t("titulo"),
    description: t("descripcion"),
    alternates: alternativas(idioma),
  }
}

/**
 * La portada. **Un resumen, no la página entera.**
 *
 * Con las secciones convertidas en páginas, repetirlas aquí enteras pondría el
 * mismo texto en dos direcciones, y dos direcciones con el mismo texto compiten
 * por la misma consulta: gana una a medias en vez de una bien. Aquí va lo justo
 * para decidir si seguir leyendo, y cada bloque enlaza a su página.
 *
 * ── Sigue siendo Server Component, y sigue siendo a propósito ───────────────
 *  · es la página que tiene que posicionar;
 *  · los precios llegan renderizados, sin parpadeo, en la sección que vende;
 *  · el país se deduce de las cabeceras, que solo existen en el servidor.
 */
export default async function PortadaPage({ params }: Props) {
  const { idioma } = await params
  if (!hasLocale(routing.locales, idioma)) notFound()
  setRequestLocale(idioma)

  const [cookiesPeticion, cabeceras, planes, paises] = await Promise.all([
    cookies(),
    headers(),
    obtenerPlanesPublicos(),
    obtenerPaisesOperados(),
  ])

  const [producto, vistaPrevia, precios, preguntas] = await Promise.all([
    getTranslations({ locale: idioma, namespace: "producto" }),
    getTranslations({ locale: idioma, namespace: "vistaPrevia" }),
    getTranslations({ locale: idioma, namespace: "precios" }),
    getTranslations({ locale: idioma, namespace: "preguntas" }),
  ])
  const { region, operados } = regionDeLaPeticion(cookiesPeticion, cabeceras, paises)

  return (
    <>
      {/* El producto y sus precios en los tres países, en la forma que lee una
          máquina. Los precios son los MISMOS que pinta `PreciosList`. Las
          preguntas NO se declaran aquí: solo se enseñan cinco, y un `FAQPage`
          sobre una página que no las tiene todas promete lo que no da. */}
      <DatosEstructurados datos={await grafoAplicacion(idioma, planes, operados)} />

      <Hero region={region} />

      <ValorList resumen enlace={{ href: rutas.producto, texto: producto("verTodo") }} />

      <VistaPrevia
        region={region}
        resumen
        enlace={{ href: rutas.vistaPrevia, texto: vistaPrevia("verTodo") }}
      />

      <PreciosList
        planes={planes}
        region={region}
        operados={operados}
        resumen
        enlace={{ href: rutas.precios, texto: precios("verTodo") }}
      />

      {/* Las objeciones van DESPUÉS del precio y antes del cierre: es donde
          aparecen de verdad, justo después de mirar cuánto cuesta. */}
      <PreguntasFrecuentes
        limite={5}
        enlace={{ href: rutas.preguntas, texto: preguntas("verTodo") }}
      />

      <Cierre tono="base" />
    </>
  )
}
