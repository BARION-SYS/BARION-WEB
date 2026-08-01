import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { DatosEstructurados } from "@/components/common/DatosEstructurados"
import { Cierre } from "@/components/sections/Cierre"
import { Hero } from "@/components/sections/Hero"
import { PreciosList } from "@/components/sections/PreciosList"
import { PreguntasFrecuentes } from "@/components/sections/PreguntasFrecuentes"
import { ValorList } from "@/components/sections/ValorList"
import { VistaPrevia } from "@/components/sections/VistaPrevia"
import { rutas, rutasMaquina } from "@/config/rutas"
import { obtenerPlanesPublicos } from "@/services/planes"
import { COOKIE_REGION, regionDesdeCabeceras } from "@/lib/region"
import { grafoLanding } from "@/lib/seo"

/**
 * La canónica se declara AQUÍ y no en el layout raíz: en el layout la heredaría
 * también el 404, que pasaría a decir «la página buena de esta dirección
 * inventada es la portada» y le pediría al buscador que indexe la portada una
 * vez por cada enlace roto que alguien publique.
 *
 * Existe aunque el sitio tenga una sola página: sin ella, `/?utm_source=…` y
 * `/?ref=…` son direcciones distintas para un buscador, y el reparto de señales
 * entre las tres es lo que hace que ninguna posicione.
 */
export const metadata: Metadata = {
  alternates: {
    canonical: rutas.inicio,
    // El sitio en texto plano, anunciado en la cabecera para quien lo busque
    // sin adivinar la dirección. Ver `app/llms.txt/route.ts`.
    types: { "text/plain": rutasMaquina.llms },
  },
}

/**
 * EXCEPCIÓN CONSCIENTE a «la page.tsx es el padre y lleva 'use client'».
 * Esta es Server Component, y a propósito:
 *
 *  · es la única página del sistema que tiene que posicionar en un buscador;
 *  · los precios tienen que llegar ya renderizados, sin parpadeo, en la sección
 *    que vende;
 *  · el país se deduce de las cabeceras de la petición, que solo existen aquí.
 *
 * Lo interactivo —selector de país, menú móvil, animaciones— son componentes
 * cliente colgando de ella. NO ponerle 'use client': rompería las tres cosas.
 */
export default async function LandingPage() {
  const [cookiesPeticion, cabeceras, planes] = await Promise.all([
    cookies(),
    headers(),
    obtenerPlanesPublicos(),
  ])

  const region = regionDesdeCabeceras(
    cookiesPeticion.get(COOKIE_REGION)?.value,
    cabeceras.get("accept-language") ?? undefined
  )

  return (
    <>
      {/* El producto, sus precios en los tres países y las preguntas, en la
          forma que lee una máquina. Los precios son los MISMOS que pinta
          `PreciosList` — salen del mismo `planes`. */}
      <DatosEstructurados datos={grafoLanding(planes)} />
      <Hero region={region} />
      <ValorList />
      <VistaPrevia region={region} />
      <PreciosList planes={planes} region={region} />
      {/* Las objeciones van DESPUÉS del precio y antes del cierre: es donde
          aparecen de verdad, justo después de mirar cuánto cuesta. */}
      <PreguntasFrecuentes />
      <Cierre />
    </>
  )
}
