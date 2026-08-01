import { envPublico } from "@/config/env.public"
import { CORREO_CONTACTO, rutasApp } from "@/config/rutas"
import {
  DESCRIPCION,
  IDIOMA,
  LOGO_SOCIAL,
  NOMBRE_SITIO,
  PAISES_SERVIDOS,
  RESUMEN_IA,
} from "@/config/sitio"
import type { CodigoRegion } from "@/config/regiones"
import { preguntasFrecuentes } from "@/constants/faq"
import { bloquesValor, capacidadesExtra } from "@/constants/valor"
import { montoDecimal } from "@/lib/currency"
import { nombresDeRegion } from "@/lib/region"
import type { PlanPublico } from "@/types/landing"

/**
 * Lo que esta página le cuenta a una MÁQUINA.
 *
 * El texto visible lo escribe un humano para otro humano; el JSON-LD dice lo
 * mismo en la forma en que un buscador —y hoy también un modelo de lenguaje—
 * puede leerlo sin adivinar: qué producto es, cuánto cuesta en cada país, en
 * qué países opera y qué se pregunta la gente antes de contratarlo.
 *
 * Todo sale de las MISMAS fuentes que la página (`constants/`, `config/`, los
 * planes de la API): un dato estructurado que contradice al texto visible es
 * peor que no tenerlo — se penaliza.
 */

/** Un nodo de schema.org. No hay tipos oficiales; `unknown` antes que `any`. */
type Nodo = Record<string, unknown>

/**
 * Dirección pública del sitio. Sin ella no hay `@id` estable —el identificador
 * de un nodo de schema.org es una URL absoluta— así que el grafo entero se
 * omite en vez de publicarse apuntando a `localhost`. En desarrollo eso es lo
 * correcto: un dato estructurado con direcciones falsas no ayuda a nadie.
 */
export const SITIO_URL = envPublico.siteUrl

/** Une una ruta con el dominio del sitio. `undefined` si no hay dominio. */
export function urlAbsoluta(ruta: string): string | undefined {
  return SITIO_URL ? new URL(ruta, SITIO_URL).toString() : undefined
}

const pais = (codigo: CodigoRegion): Nodo => ({
  "@type": "Country",
  identifier: codigo,
  name: nombresDeRegion[codigo],
})

const idOrganizacion = (sitio: string) => `${sitio}#organizacion`
const idAplicacion = (sitio: string) => `${sitio}#aplicacion`

/**
 * Quién publica y qué sitio es. Va en el layout porque vale para TODA página
 * servida desde aquí, incluido el 404.
 */
export function grafoSitio(): Nodo | null {
  const sitio = SITIO_URL
  if (!sitio) return null

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": idOrganizacion(sitio),
        name: NOMBRE_SITIO,
        url: sitio,
        logo: new URL(LOGO_SOCIAL, sitio).toString(),
        email: CORREO_CONTACTO,
        description: RESUMEN_IA,
        areaServed: PAISES_SERVIDOS.map(pais),
      },
      {
        "@type": "WebSite",
        "@id": `${sitio}#sitio`,
        url: sitio,
        name: NOMBRE_SITIO,
        description: DESCRIPCION,
        inLanguage: IDIOMA,
        publisher: { "@id": idOrganizacion(sitio) },
        // Sin `SearchAction`: este sitio no tiene buscador, y declarar uno que
        // no existe es exactamente el tipo de dato que se penaliza.
      },
    ],
  }
}

/**
 * El producto y sus precios, más las preguntas frecuentes.
 *
 * Se publican los precios de LOS TRES PAÍSES, no solo los de la región que se
 * está mirando: quien indexa la página entra una vez, sin cookie y con la
 * cabecera de su centro de datos, y lo que interesa es que sepa que el mismo
 * plan tiene precio propio en Colombia, Estados Unidos y España.
 */
export function grafoLanding(planes: PlanPublico[]): Nodo | null {
  const sitio = SITIO_URL
  if (!sitio) return null

  return {
    "@context": "https://schema.org",
    "@graph": [aplicacion(planes, sitio), preguntas(sitio)],
  }
}

function aplicacion(planes: PlanPublico[], sitio: string): Nodo {
  return {
    "@type": "SoftwareApplication",
    "@id": idAplicacion(sitio),
    name: NOMBRE_SITIO,
    url: sitio,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Software de gestión para barberías",
    // Corre en el navegador: no hay binario que instalar en ningún sistema.
    operatingSystem: "Web",
    browserRequirements: "Requiere JavaScript. Navegador moderno de escritorio o móvil.",
    description: RESUMEN_IA,
    inLanguage: IDIOMA,
    isAccessibleForFree: false,
    provider: { "@id": idOrganizacion(sitio) },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dueños y administradores de barberías",
    },
    areaServed: PAISES_SERVIDOS.map(pais),
    featureList: [
      ...bloquesValor.flatMap((bloque) => bloque.detalles),
      ...capacidadesExtra.map((capacidad) => capacidad.texto),
    ],
    // Sin `aggregateRating` ni `review`: no hay clientes todavía. Inventar una
    // valoración es la manera más rápida de que a un sitio se le retire el
    // resultado enriquecido para siempre.
    offers: planes.flatMap((plan) =>
      plan.precios.map((precio) => {
        const monto = montoDecimal(precio.montoCentavos, precio.moneda)
        return {
          "@type": "Offer",
          name: plan.nombre,
          description: plan.descripcion,
          category: "Suscripción",
          price: monto,
          priceCurrency: precio.moneda,
          availability: "https://schema.org/InStock",
          url: rutasApp.registro,
          eligibleRegion: pais(precio.codigoPais),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: monto,
            priceCurrency: precio.moneda,
            // Cuánto dura lo que se paga: sin esto, «89000» se lee como el
            // precio de comprar el programa, no el de un mes de servicio.
            billingDuration: 1,
            billingIncrement: 1,
            unitCode: precio.periodo === "anual" ? "ANN" : "MON",
          },
        }
      })
    ),
  }
}

function preguntas(sitio: string): Nodo {
  return {
    "@type": "FAQPage",
    "@id": `${sitio}#preguntas-frecuentes`,
    url: `${sitio}#preguntas`,
    inLanguage: IDIOMA,
    about: { "@id": idAplicacion(sitio) },
    mainEntity: preguntasFrecuentes.map(({ pregunta, respuesta }) => ({
      "@type": "Question",
      name: pregunta,
      acceptedAnswer: { "@type": "Answer", text: respuesta },
    })),
  }
}
