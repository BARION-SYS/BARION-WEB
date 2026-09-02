import type { Metadata } from "next"
import {
  CLAVES_BLOQUE,
  CLAVES_CAPACIDAD,
  CLAVES_GRUPO_PREGUNTAS,
  esClavePlan,
  preguntasPorGrupo,
} from "@/config/contenido"
import { getTranslations } from "next-intl/server"
import { envPublico } from "@/config/env.public"
import { etiquetaHtml, localeSocial, type Idioma } from "@/config/idiomas"
import { periodos } from "@/config/periodos"
import type { CodigoRegion } from "@/config/regiones"
import { CORREO_CONTACTO, rutas, rutasApp, type ClaveRuta } from "@/config/rutas"
import { IMAGEN_SOCIAL, LOGO_SOCIAL, NOMBRE_SITIO } from "@/config/sitio"
import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { montoDecimal } from "@/lib/currency"
import type { PlanPublico } from "@/types/landing"

/**
 * Lo que esta página le cuenta a una MÁQUINA.
 *
 * El texto visible lo escribe un humano para otro humano; el JSON-LD dice lo
 * mismo en la forma en que un buscador —y hoy también un modelo de lenguaje—
 * puede leerlo sin adivinar: qué producto es, cuánto cuesta en cada país, en qué
 * países opera y qué se pregunta la gente antes de contratarlo.
 *
 * Todo sale de las MISMAS fuentes que la página (el diccionario del idioma que
 * se está sirviendo y los planes de la API): un dato estructurado que contradice
 * al texto visible es peor que no tenerlo — se penaliza.
 */

/** Un nodo de schema.org. No hay tipos oficiales; `unknown` antes que `any`. */
type Nodo = Record<string, unknown>

/**
 * Dirección pública del sitio. Sin ella no hay `@id` estable —el identificador
 * de un nodo de schema.org es una URL absoluta— así que el grafo entero se omite
 * en vez de publicarse apuntando a `localhost`. En desarrollo eso es lo
 * correcto: un dato estructurado con direcciones falsas no ayuda a nadie.
 */
export const SITIO_URL = envPublico.siteUrl

/** Une una ruta con el dominio del sitio. `undefined` si no hay dominio. */
export function urlAbsoluta(ruta: string): string | undefined {
  return SITIO_URL ? new URL(ruta, SITIO_URL).toString() : undefined
}

/**
 * La ruta de una página en un idioma, o la portada si no se dice cuál.
 *
 * Sale de `getPathname` y no de concatenar el prefijo a mano: es la MISMA
 * función que usa el `Link` del sitio, así que la canónica no puede discrepar de
 * la dirección a la que de verdad se llega.
 */
function rutaDe(idioma: Idioma, clave: ClaveRuta = "inicio"): string {
  return getPathname({ href: rutas[clave], locale: idioma })
}

/**
 * La canónica de esta página y sus hermanas en los otros idiomas.
 *
 * ── Por qué las dos cosas van juntas ────────────────────────────────────────
 * Son la misma afirmación vista por los dos lados: «esta es la dirección buena
 * de este contenido» y «estas son las demás versiones del mismo contenido».
 * Publicar la canónica sin el `hreflang` hace que las dos versiones compitan
 * entre ellas; publicar el `hreflang` sin canónica deja que `?utm_source=…`
 * multiplique cada una.
 *
 * `x-default` apunta al idioma por defecto: es lo que un buscador sirve a quien
 * no encaja en ninguno de los declarados.
 *
 * **Se declara por PÁGINA y nunca en el layout**: Next no fusiona `alternates`,
 * lo sustituye entero, así que uno declarado arriba desaparecería en cuanto una
 * página declarara el suyo — y el 404 heredaría una canónica que diría que la
 * página buena de cada dirección rota es la portada.
 */
export function alternativas(idioma: Idioma, clave?: ClaveRuta): Metadata["alternates"] {
  const idiomas = Object.fromEntries(
    routing.locales.map((codigo) => [etiquetaHtml[codigo], rutaDe(codigo, clave)])
  )

  return {
    canonical: rutaDe(idioma, clave),
    languages: {
      ...idiomas,
      "x-default": rutaDe(routing.defaultLocale, clave),
    },
  }
}

/**
 * Título, descripción, canónica y tarjeta social de una página. **Las cinco
 * cosas juntas, y por eso existe.**
 *
 * ── Qué estaba roto ─────────────────────────────────────────────────────────
 * Cada página declaraba su `title`, su `description` y su `alternates`, y
 * heredaba el `openGraph` del layout sin tocarlo: **Next SUSTITUYE `openGraph`
 * entero, no lo fusiona**, exactamente igual que hace con `alternates`. El
 * resultado, comprobado en producción, era que `/es/precios` se compartía con el
 * título de la portada y con `og:url` apuntando a `/es` — dos afirmaciones
 * distintas, en la misma cabecera, sobre cuál es la dirección buena.
 *
 * ── Por qué es UNA función y no cuatro ──────────────────────────────────────
 * Porque `og:url` y la canónica tienen que ser la MISMA dirección, y el único
 * modo de garantizarlo es que las escriba el mismo sitio a partir de la misma
 * `rutaDe()`. Con un constructor para la canónica y otro para la tarjeta,
 * discrepan el día que alguien use uno y olvide el otro — que es literalmente lo
 * que ya pasó.
 *
 * La portada lleva `absolute`: su título ya nombra la marca («Barion — Software
 * de gestión para barberías»), y la plantilla `%s · Barion` del layout la
 * repetiría dos veces en el mismo renglón del resultado.
 */
export async function metadatosDePagina(idioma: Idioma, clave: ClaveRuta): Promise<Metadata> {
  const pagina = await getTranslations({ locale: idioma, namespace: `paginas.${clave}` })
  const identidad = await getTranslations({ locale: idioma, namespace: "identidad" })

  const titulo = pagina("titulo")
  const descripcion = pagina("descripcion")
  const url = rutaDe(idioma, clave)

  return {
    title: clave === "inicio" ? { absolute: titulo } : titulo,
    description: descripcion,
    alternates: alternativas(idioma, clave),
    openGraph: {
      type: "website",
      siteName: NOMBRE_SITIO,
      locale: localeSocial[idioma],
      // Relativa a propósito: Next la resuelve contra `metadataBase`, así que en
      // desarrollo no se publica un dominio inventado.
      url,
      title: titulo,
      description: descripcion,
      images: [{ ...IMAGEN_SOCIAL, alt: identidad("altImagenSocial") }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [IMAGEN_SOCIAL.url],
    },
  }
}

const idOrganizacion = (sitio: string) => `${sitio}#organizacion`
const idAplicacion = (sitio: string, idioma: Idioma) => `${sitio}/${idioma}#aplicacion`

/** Solo necesita saber traducir un código de país; nada más del diccionario. */
type NombreDePais = (codigo: CodigoRegion) => string

const pais = (codigo: CodigoRegion, nombre: NombreDePais): Nodo => ({
  "@type": "Country",
  identifier: codigo,
  name: nombre(codigo),
})

/**
 * Quién publica y qué sitio es. Va en el layout porque vale para TODA página
 * servida desde aquí, incluido el 404.
 *
 * **La organización es UNA sola en todos los idiomas** —una empresa no se
 * duplica al traducir su web— y por eso su `@id` no lleva idioma. El `WebSite`
 * sí: son dos versiones indexables y cada una declara en qué idioma está.
 *
 * **Sin `areaServed`, y no es un olvido.** Dónde opera Barion lo dice la api y
 * cambia con el negocio; este grafo lo pinta el layout, que se sirve en cada
 * página y no tiene por qué ir a buscarlo. El dato vive donde se puede
 * mantener: en el nodo de la aplicación, que ya lo recibe (`grafoLanding`).
 */
export async function grafoSitio(idioma: Idioma): Promise<Nodo | null> {
  const sitio = SITIO_URL
  if (!sitio) return null

  const t = await getTranslations({ locale: idioma, namespace: "identidad" })

  const enEsteIdioma = `${sitio}/${idioma}`

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
        description: t("resumenIA"),
      },
      {
        "@type": "WebSite",
        "@id": `${enEsteIdioma}#sitio`,
        url: enEsteIdioma,
        name: NOMBRE_SITIO,
        description: t("descripcion"),
        inLanguage: etiquetaHtml[idioma],
        publisher: { "@id": idOrganizacion(sitio) },
        // Sin `SearchAction`: este sitio no tiene buscador, y declarar uno que
        // no existe es exactamente el tipo de dato que se penaliza.
      },
    ],
  }
}

/**
 * El producto y sus precios.
 *
 * Se publican los precios de TODOS los países con tarifa, no solo los de la
 * región que se está mirando: quien indexa la página entra una vez, sin cookie y
 * con la cabecera de su centro de datos, y lo que interesa es que sepa que el
 * mismo plan tiene precio propio en cada mercado.
 *
 * **`operados` es otra cosa que los precios publicados**, y por eso viaja
 * aparte: un país puede tener tarifa cargada y estar cerrado. Lo que declara
 * `areaServed` es dónde se puede CONTRATAR, que es lo que un buscador entiende
 * por «área de servicio» — no dónde hay una cifra en una tabla.
 */
export async function grafoAplicacion(
  idioma: Idioma,
  planes: PlanPublico[],
  operados: CodigoRegion[]
): Promise<Nodo | null> {
  const sitio = SITIO_URL
  if (!sitio) return null

  const t = await getTranslations({ locale: idioma, namespace: "identidad" })
  const precios = await getTranslations({ locale: idioma, namespace: "precios" })
  const producto = await getTranslations({ locale: idioma, namespace: "producto" })
  const paginas = await getTranslations({ locale: idioma, namespace: "paginas" })
  const nombrePais = await getTranslations({ locale: idioma, namespace: "regiones" })

  const ofertas = planes.flatMap((plan) =>
    plan.precios.map((precio) => {
      const monto = montoDecimal(precio.montoCentavos, precio.moneda)
      return {
        "@type": "Offer",
        name: plan.nombre,
        description: esClavePlan(plan.codigo)
          ? precios(`planes.${plan.codigo}.descripcion`)
          : undefined,
        price: monto,
        priceCurrency: precio.moneda,
        availability: "https://schema.org/InStock",
        url: rutasApp.registro,
        eligibleRegion: pais(precio.codigoPais, nombrePais),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: monto,
          priceCurrency: precio.moneda,
          // Cuántos meses cubre el importe. El semestral no tiene código propio
          // en UN/CEFACT, así que se declara como seis meses en vez de
          // aproximarlo a un año: un dato estructurado que redondea el período
          // contradice al precio que la página enseña al lado.
          billingDuration: periodos[precio.periodo].meses,
          billingIncrement: 1,
          unitCode: "MON",
        },
      }
    })
  )

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": idAplicacion(sitio, idioma),
        name: NOMBRE_SITIO,
        url: `${sitio}${rutaDe(idioma)}`,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: paginas("producto.titulo"),
        // Corre en el navegador: no hay binario que instalar en ningún sistema.
        operatingSystem: "Web",
        description: t("resumenIA"),
        inLanguage: etiquetaHtml[idioma],
        isAccessibleForFree: false,
        provider: { "@id": idOrganizacion(sitio) },
        areaServed: operados.map((codigo) => pais(codigo, nombrePais)),
        featureList: [
          ...CLAVES_BLOQUE.flatMap(
            (clave) => producto.raw(`bloques.${clave}.detalles`) as string[]
          ),
          ...CLAVES_CAPACIDAD.map((clave) => producto(`capacidades.${clave}`)),
        ],
        // Sin `aggregateRating` ni `review`: no hay clientes todavía. Inventar
        // una valoración es la manera más rápida de que a un sitio se le retire
        // el resultado enriquecido para siempre.
        //
        // `offers` se OMITE si no hay ninguna tarifa publicable, en vez de
        // declarar una lista vacía: un nodo que dice «tengo ofertas: ninguna» es
        // peor que uno que no habla de precios, y es lo que marca un validador.
        ...(ofertas.length > 0 ? { offers: ofertas } : {}),
      },
    ],
  }
}

/**
 * Un escalón de la ruta de migas.
 *
 * `clave` es la ruta a la que lleva, y falta en los niveles que **no tienen
 * página**: «Legal» agrupa tres documentos y no es ninguno.
 */
export interface EscalonMiga {
  texto: string
  clave?: ClaveRuta
}

/**
 * Qué es esta dirección y dónde está dentro del sitio.
 *
 * Son dos nodos y van juntos porque responden a la misma pregunta desde dos
 * lados: el `WebPage` dice «esto es una página de este sitio, publicada por esta
 * organización» —hasta ahora cada página soltaba su nodo suelto sin decir de qué
 * sitio formaba parte— y el `BreadcrumbList` dice por dónde se llega. Ese
 * segundo es el que hace que un resultado profundo salga como
 * «Barion › Legal › Términos» en vez de como una URL cruda, que es la diferencia
 * entre parecer parte de un sitio y parecer una página suelta.
 *
 * ── Un nivel sin página NO entra en el grafo, aunque sí se pinte ────────────
 * `Migas` enseña «Legal» porque orienta a quien lee. Aquí se omite: un
 * `ListItem` intermedio sin `item` es una posición de la ruta a la que no se
 * puede ir, y un validador la marca como ruta incompleta. Lo que se publica es
 * la ruta por la que de verdad se navega. El último escalón —la página actual—
 * sí lleva su dirección: es la que el buscador enseña.
 */
export async function grafoPagina(
  idioma: Idioma,
  clave: ClaveRuta,
  migas: EscalonMiga[] = []
): Promise<Nodo | null> {
  const sitio = SITIO_URL
  if (!sitio) return null

  const pagina = await getTranslations({ locale: idioma, namespace: `paginas.${clave}` })
  const navegacion = await getTranslations({ locale: idioma, namespace: "navegacion" })

  const url = `${sitio}${rutaDe(idioma, clave)}`
  const enEsteIdioma = `${sitio}/${idioma}`

  // La portada no tiene ruta: es el primer escalón. Declararle una de un solo
  // item sería decir «para llegar a Inicio, pasa por Inicio».
  const escalones: EscalonMiga[] =
    clave === "inicio"
      ? []
      : [
          { texto: navegacion("inicio"), clave: "inicio" },
          ...migas,
          { texto: pagina("titulo"), clave },
        ]

  // `flatMap` y no `filter` + `map`: `rutaDe` tiene la portada como valor por
  // defecto, así que un escalón sin `clave` que se colara aquí no fallaría —
  // publicaría la portada con el nombre de otra cosa. Con el destructurado
  // dentro, el que no lleva ruta no puede llegar a construir una.
  const itemListElement = escalones.flatMap(({ texto, clave: destino }) =>
    destino === undefined
      ? []
      : [{ "@type": "ListItem", name: texto, item: `${sitio}${rutaDe(idioma, destino)}` }]
  )
  // La posición se numera DESPUÉS de descartar: `itemListElement` tiene que ser
  // 1, 2, 3… sin huecos, y un salto es lo que un validador lee como ruta rota.
  const conPosicion = itemListElement.map((item, indice) => ({ ...item, position: indice + 1 }))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#pagina`,
        url,
        name: pagina("titulo"),
        description: pagina("descripcion"),
        inLanguage: etiquetaHtml[idioma],
        isPartOf: { "@id": `${enEsteIdioma}#sitio` },
        about: { "@id": idOrganizacion(sitio) },
        ...(conPosicion.length > 0 ? { breadcrumb: { "@id": `${url}#migas` } } : {}),
      },
      ...(conPosicion.length > 0
        ? [
            {
              "@type": "BreadcrumbList",
              "@id": `${url}#migas`,
              itemListElement: conPosicion,
            },
          ]
        : []),
    ],
  }
}

/**
 * Las preguntas, en la página que de verdad las tiene.
 *
 * **Ya no se publica desde la portada**, y es la consecuencia buena de que cada
 * sección sea una página: un `FAQPage` declarado en una portada que solo enseña
 * cuatro preguntas de dieciocho promete un contenido que esa dirección no tiene.
 */
export async function grafoPreguntas(idioma: Idioma): Promise<Nodo | null> {
  const sitio = SITIO_URL
  if (!sitio) return null

  const t = await getTranslations({ locale: idioma, namespace: "preguntas" })

  const url = `${sitio}${rutaDe(idioma, "preguntas")}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${url}#preguntas-frecuentes`,
        url,
        inLanguage: etiquetaHtml[idioma],
        about: { "@id": idAplicacion(sitio, idioma) },
        mainEntity: CLAVES_GRUPO_PREGUNTAS.flatMap((grupo) =>
          preguntasPorGrupo[grupo].map((clave) => ({
            "@type": "Question",
            name: t(`lista.${clave}.pregunta`),
            acceptedAnswer: { "@type": "Answer", text: t(`lista.${clave}.respuesta`) },
          }))
        ),
      },
    ],
  }
}
