import { getTranslations } from "next-intl/server"
import {
  CLAVES_BLOQUE,
  CLAVES_CAPACIDAD,
  CLAVES_GARANTIA,
  CLAVES_GRUPO_PREGUNTAS,
  CLAVES_PASO,
  esClaveFuncion,
  esClavePlan,
  preguntasPorGrupo,
} from "@/config/contenido"
import { nombresDeIdioma } from "@/config/idiomas"
import {
  esRegionConocida,
  regiones,
  REGIONES_CONOCIDAS,
  type CodigoRegion,
} from "@/config/regiones"
import { CORREO_CONTACTO, rutas, rutasApp } from "@/config/rutas"
import { NOMBRE_SITIO } from "@/config/sitio"
import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { formatMoney } from "@/lib/currency"
import { SITIO_URL, urlAbsoluta } from "@/lib/seo"
import { obtenerPaisesOperados } from "@/services/paises"
import { obtenerPlanesPublicos } from "@/services/planes"
import type { PlanPublico } from "@/types/landing"

/**
 * `/llms.txt` — el sitio contado para un modelo de lenguaje.
 *
 * Un asistente al que le preguntan «¿qué software uso para mi barbería?» no lee
 * la página: lee lo que puede recuperar barato y sin ejecutar JavaScript. Esta
 * es esa versión — el mismo contenido de la landing en texto plano, con los
 * precios de cada mercado y las preguntas frecuentes enteras.
 *
 * Sale de las MISMAS fuentes que la página: si fuera un archivo escrito a mano
 * en `public/`, a la segunda subida de precios estaría mintiendo, y una
 * respuesta con el precio viejo la da el asistente sin avisar a nadie.
 *
 * ── Por qué hay UNO solo y va en el idioma por defecto ──────────────────────
 * `/llms.txt` es una convención de archivo único en la raíz, sin idioma en la
 * dirección. Publicarlo por idioma exigiría inventarse una convención propia
 * que ningún cliente busca. Lo que sí hace es **enlazar las dos versiones del
 * sitio** en su sección final: un modelo que necesite la inglesa sabe dónde
 * está, y la ficha del producto —que es lo que se cita— es la misma en las dos.
 *
 * `revalidate` igual que los planes (una hora): el resto son constantes del
 * repositorio, que solo cambian con un despliegue.
 */
export const revalidate = 3600

/**
 * Los espacios de nombres que este documento necesita, todos del idioma de
 * referencia. Se piden de una vez para no repetir `getTranslations` en cada
 * sección — y porque el idioma de este archivo es una decisión del documento
 * entero, no de cada apartado.
 */
async function traductores() {
  const locale = routing.defaultLocale

  const [identidad, producto, vistaPrevia, precios, preguntas, regionesTexto] = await Promise.all([
    getTranslations({ locale, namespace: "identidad" }),
    getTranslations({ locale, namespace: "producto" }),
    getTranslations({ locale, namespace: "vistaPrevia" }),
    getTranslations({ locale, namespace: "precios" }),
    getTranslations({ locale, namespace: "preguntas" }),
    getTranslations({ locale, namespace: "regiones" }),
  ])

  return { identidad, producto, vistaPrevia, precios, preguntas, regionesTexto }
}

type Traductores = Awaited<ReturnType<typeof traductores>>

export async function GET(): Promise<Response> {
  // Dónde opera Barion lo dice la api, igual que en la landing. Importa más
  // aquí que en ninguna otra superficie: lo que diga este archivo lo repite un
  // asistente como si fuera la ficha del producto, y «opera en España» no se
  // puede desdecir una vez que se ha citado.
  const [planes, paises] = await Promise.all([obtenerPlanesPublicos(), obtenerPaisesOperados()])

  const operados = paises
    ? (paises.map((pais) => pais.codigo).filter(esRegionConocida) as CodigoRegion[])
    : REGIONES_CONOCIDAS

  const t = await traductores()

  return new Response(construirDocumento(t, planes, operados), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}

function construirDocumento(
  t: Traductores,
  planes: PlanPublico[],
  operados: CodigoRegion[]
): string {
  return [
    `# ${NOMBRE_SITIO}`,
    "",
    `> ${t.identidad("resumenIA")}`,
    "",
    t.identidad("descripcion"),
    "",
    seccionQuienLoUsa(),
    seccionQueNoEs(),
    seccionCapacidades(t),
    seccionReserva(t),
    seccionPrecios(t, planes, operados),
    seccionPreguntas(t),
    seccionEnlaces(),
  ].join("\n")
}

/**
 * Estas dos secciones no salen del diccionario y no es un descuido: no se
 * pintan en ninguna página. Son la ficha que un modelo necesita para no
 * equivocarse al describir el producto —a quién sirve y qué NO es—, y ese es
 * exactamente el contexto que un sitio de venta no escribe para humanos.
 */
function seccionQuienLoUsa(): string {
  return [
    "## Para quién es",
    "",
    "- El **dueño o administrador de una barbería** que quiere dejar el cuaderno: es quien contrata y quien decide.",
    "- El **barbero** del equipo, que entra a su propio panel y ve su agenda y su liquidación, y nada más.",
    "- El **cliente final** NO contrata Barion ni se registra en él: reserva desde el escaparate público de la barbería que ya conoce.",
    "",
  ].join("\n")
}

function seccionQueNoEs(): string {
  return [
    "## Qué NO es",
    "",
    "- **No es un marketplace ni un directorio de barberías.** No hay buscador donde un cliente compare locales: cada barbería tiene su escaparate y a él llega quien ella invita.",
    "- **No procesa pagos de clientes finales.** Registra con qué método se pagó cada cita para que la caja y las comisiones cuadren; el cobro lo sigue haciendo la barbería.",
    "- **No asume el coste de la mensajería.** WhatsApp y SMS son integraciones que cada barbería conecta con su propia cuenta de proveedor, así que no van dentro del precio de la suscripción.",
    "- **No es una agenda genérica** con otro nombre: la ficha del cliente, la comisión del barbero y la cita son el mismo dato, no tres copias que alguien sincroniza.",
    "",
  ].join("\n")
}

function seccionCapacidades(t: Traductores): string {
  const bloques = CLAVES_BLOQUE.map((clave) => {
    const detalles = t.producto.raw(`bloques.${clave}.detalles`) as string[]
    return [
      `### ${t.producto(`bloques.${clave}.titulo`)}`,
      "",
      t.producto(`bloques.${clave}.descripcion`),
      "",
      ...detalles.map((detalle) => `- ${detalle}`),
      "",
    ].join("\n")
  })

  return [
    "## Qué hace",
    "",
    ...bloques,
    "### Además",
    "",
    ...CLAVES_CAPACIDAD.map((clave) => `- ${t.producto(`capacidades.${clave}`)}`),
    "",
  ].join("\n")
}

function seccionReserva(t: Traductores): string {
  return [
    "## Cómo llega una cita",
    "",
    ...CLAVES_PASO.map(
      (clave, indice) =>
        `${indice + 1}. **${t.vistaPrevia(`pasos.${clave}.titulo`)}** — ${t.vistaPrevia(`pasos.${clave}.descripcion`)}`
    ),
    "",
  ].join("\n")
}

function seccionPrecios(t: Traductores, planes: PlanPublico[], operados: CodigoRegion[]): string {
  const tope = (cantidad: number | null | undefined, clave: "limiteSedes" | "limiteBarberos") =>
    cantidad === undefined
      ? null
      : cantidad === null
        ? t.precios(`${clave}SinTope`)
        : t.precios(clave, { cantidad })

  const lineas = planes.map((plan) => {
    const descripcion = esClavePlan(plan.codigo)
      ? t.precios(`planes.${plan.codigo}.descripcion`)
      : null

    const topes = [
      tope(plan.limites.sedes, "limiteSedes"),
      tope(plan.limites.barberos, "limiteBarberos"),
    ].filter((valor): valor is string => valor !== null)

    const precios = plan.precios.map((precio) => {
      const { moneda, locale } = regiones[precio.codigoPais]
      const importe = formatMoney(precio.montoCentavos, precio.moneda, locale)
      return `  - ${t.regionesTexto(precio.codigoPais)} (${moneda}): ${importe} ${t.precios(`periodos.${precio.periodo}.sufijo`)}`
    })

    return [
      // «Plan recomendado» y no «el más elegido»: aquí escribe la máquina que
      // luego cita un asistente, y no hay clientes cuyo número respalde un
      // superlativo. Lo que se puede defender es la recomendación.
      `### ${plan.nombre}${plan.destacado ? " (plan recomendado)" : ""}`,
      "",
      ...(descripcion ? [descripcion, ""] : []),
      ...(topes.length > 0 ? [`- ${topes.join(", ")}`] : []),
      ...plan.funciones.map(
        (clave) => `- ${esClaveFuncion(clave) ? t.precios(`funciones.${clave}`) : clave}`
      ),
      // Sin ninguna tarifa publicable no se calla el plan —existe— pero tampoco
      // se le pone cifra: se dice lo mismo que la tarjeta de la página.
      ...(precios.length > 0
        ? ["- Precio por barbería:", ...precios]
        : [`- Precio por barbería: ${t.precios("consultar").toLowerCase()}.`]),
      "",
    ].join("\n")
  })

  return [
    "## Precios",
    "",
    `Barion opera en ${operados.map((codigo) => `${t.regionesTexto(codigo)} (${regiones[codigo].moneda})`).join(", ")}.`,
    "El precio de cada país es propio, no la conversión del cambio del día, y se fija por el país donde factura la barbería —no por dónde se mire la página—.",
    "El importe es **por barbería**, no por barbero ni por función.",
    "",
    ...lineas,
    "### Incluido en cualquier plan",
    "",
    ...CLAVES_GARANTIA.map((clave) => `- ${t.precios(`garantias.${clave}`)}`),
    `- ${t.precios("prueba")}`,
    "",
  ].join("\n")
}

function seccionPreguntas(t: Traductores): string {
  const grupos = CLAVES_GRUPO_PREGUNTAS.map((grupo) =>
    [
      `### ${t.preguntas(`grupos.${grupo}`)}`,
      "",
      ...preguntasPorGrupo[grupo].map(
        (clave) =>
          `**${t.preguntas(`lista.${clave}.pregunta`)}**\n${t.preguntas(`lista.${clave}.respuesta`)}\n`
      ),
    ].join("\n")
  )

  return ["## Preguntas frecuentes", "", ...grupos].join("\n")
}

function seccionEnlaces(): string {
  const porIdioma = routing.locales
    .map((idioma) => {
      const url = urlAbsoluta(getPathname({ href: rutas.inicio, locale: idioma }))
      return url ? `- Sitio en ${nombresDeIdioma[idioma]}: ${url}` : null
    })
    .filter((linea): linea is string => linea !== null)

  return [
    "## Enlaces",
    "",
    ...(SITIO_URL ? [`- Sitio público: ${SITIO_URL}`] : []),
    ...porIdioma,
    `- Crear una barbería (prueba de 7 días): ${rutasApp.registro}`,
    `- Entrar al panel: ${rutasApp.entrar}`,
    `- Contacto: ${CORREO_CONTACTO}`,
    ...[
      ["Términos y condiciones", "terminos"],
      ["Política de privacidad", "privacidad"],
      ["Política de cookies", "cookies"],
    ].flatMap(([nombre, clave]) => {
      const url = urlAbsoluta(
        getPathname({ href: rutas[clave as "terminos"], locale: routing.defaultLocale })
      )
      return url ? [`- ${nombre}: ${url}`] : []
    }),
    "",
  ].join("\n")
}
