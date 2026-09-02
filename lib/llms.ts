import "server-only"
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
import { CORREO_CONTACTO, rutas, rutasApp, rutasMaquina, SECCIONES } from "@/config/rutas"
import { NOMBRE_SITIO } from "@/config/sitio"
import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { formatMoney } from "@/lib/currency"
import { urlAbsoluta } from "@/lib/seo"
import { obtenerPaisesOperados } from "@/services/paises"
import { obtenerPlanesPublicos } from "@/services/planes"
import type { PlanPublico } from "@/types/landing"

/**
 * El sitio contado para un modelo de lenguaje. **Dos documentos, no uno.**
 *
 * Un asistente al que le preguntan «¿qué software uso para mi barbería?» no lee
 * la página: lee lo que puede recuperar barato y sin ejecutar JavaScript. Estas
 * son esas versiones — el mismo contenido de la landing en texto plano, con los
 * precios de cada mercado y las preguntas frecuentes enteras.
 *
 * Sale de las MISMAS fuentes que la página: si fuera un archivo escrito a mano
 * en `public/`, a la segunda subida de precios estaría mintiendo, y una
 * respuesta con el precio viejo la da el asistente sin avisar a nadie.
 *
 * ── Por qué se partió en dos ────────────────────────────────────────────────
 * Había UNO, y contaba el sitio entero sin decir en qué dirección vive cada
 * parte. La convención de `llmstxt.org` espera lo contrario: un `# H1`, un
 * resumen en cita y secciones `##` cuyo contenido son **listas de enlaces**
 * `- [Nombre](url): descripción`. Las direcciones iban en crudo, así que un
 * cliente que sigue la convención al pie de la letra no encontraba qué páginas
 * existen — que es justo para lo que está el archivo. Lighthouse lo marcaba con
 * «File does not appear to contain any links».
 *
 * Así que `/llms.txt` es ahora el ÍNDICE —enlaces, y poco más— y
 * `/llms-full.txt` el texto completo. Un cliente que quiere saber qué hay sigue
 * el índice; uno que quiere citar se lleva el completo de una sola petición.
 *
 * ── Por qué van en el idioma de referencia ──────────────────────────────────
 * Los dos son convenciones de archivo único en la raíz, sin idioma en la
 * dirección. Publicarlos por idioma exigiría inventarse una convención propia
 * que ningún cliente busca. Lo que sí hacen es **enlazar las dos versiones del
 * sitio**: un modelo que necesite la inglesa sabe dónde está, y la ficha del
 * producto —que es lo que se cita— es la misma en las dos.
 */

/**
 * De cuándo es lo que se está citando.
 *
 * Un asistente que cita necesita poder decir de qué fecha es la información, y
 * este documento no tiene otra manera de declararlo. Se mueve a mano al cambiar
 * el contenido, igual que las fechas del sitemap: la del build diría que cambió
 * cada vez que se sube una dependencia.
 */
export const ACTUALIZADO_EN = "2026-09-01"

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

/**
 * Dónde opera Barion lo dice la api, igual que en la landing. Importa más aquí
 * que en ninguna otra superficie: lo que diga este archivo lo repite un
 * asistente como si fuera la ficha del producto, y «opera en España» no se puede
 * desdecir una vez que se ha citado.
 */
async function datos() {
  const [planes, paises, t] = await Promise.all([
    obtenerPlanesPublicos(),
    obtenerPaisesOperados(),
    traductores(),
  ])

  const operados = paises
    ? (paises.map((pais) => pais.codigo).filter(esRegionConocida) as CodigoRegion[])
    : REGIONES_CONOCIDAS

  return { planes, operados, t }
}

/**
 * `/llms.txt` — el ÍNDICE.
 *
 * Un `# H1`, el resumen en cita, y a partir de ahí **listas de enlaces**, que es
 * lo que la convención espera y lo que un cliente automático busca. Lo que
 * cuenta el producto entero está en `/llms-full.txt`, enlazado desde arriba: así
 * quien solo quiere saber qué páginas hay no se descarga el documento completo,
 * y quien quiere citar lo tiene en una sola petición.
 */
export async function documentoIndice(): Promise<string> {
  const { planes, operados, t } = await datos()

  return [
    `# ${NOMBRE_SITIO}`,
    "",
    `> ${t.identidad("resumenIA")}`,
    "",
    t.identidad("descripcion"),
    "",
    `Barion opera en ${operados.map((codigo) => `${t.regionesTexto(codigo)} (${regiones[codigo].moneda})`).join(", ")}. El precio es por barbería, no por barbero ni por función, y hay ${planes.length} planes.`,
    "",
    `Última actualización: ${ACTUALIZADO_EN}.`,
    "",
    seccionDocumentos(t),
    seccionPaginas(t),
    seccionOtrosIdiomas(),
    seccionAplicacion(),
    seccionLegal(),
  ].join("\n")
}

/**
 * `/llms-full.txt` — el sitio ENTERO en texto plano.
 *
 * Es lo que antes era `/llms.txt`: para quién es, qué no es, qué hace, cómo
 * llega una cita, los precios de cada mercado y las dieciocho preguntas con su
 * respuesta. Termina con los mismos enlaces que el índice, para que quien llegue
 * aquí directo tampoco tenga que adivinar direcciones.
 */
export async function documentoCompleto(): Promise<string> {
  const { planes, operados, t } = await datos()

  return [
    `# ${NOMBRE_SITIO}`,
    "",
    `> ${t.identidad("resumenIA")}`,
    "",
    t.identidad("descripcion"),
    "",
    `Última actualización: ${ACTUALIZADO_EN}.`,
    "",
    seccionQuienLoUsa(),
    seccionQueNoEs(),
    seccionCapacidades(t),
    seccionReserva(t),
    seccionPrecios(t, planes, operados),
    seccionPreguntas(t),
    seccionDocumentos(t),
    seccionPaginas(t),
    seccionOtrosIdiomas(),
    seccionAplicacion(),
    seccionLegal(),
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

/**
 * Un enlace en la sintaxis que la convención espera: `- [Nombre](url): qué es`.
 *
 * Escribir la dirección en crudo era el fallo de fondo del archivo anterior —
 * un cliente que sigue `llmstxt.org` no ve enlaces donde no hay sintaxis de
 * enlace, y sin enlaces el índice no indexa nada. Sin `SITIO_URL` la línea
 * entera se omite: media dirección no lleva a ninguna parte.
 */
function enlace(nombre: string, ruta: string, descripcion: string): string | null {
  const url = urlAbsoluta(ruta)
  return url ? `- [${nombre}](${url}): ${descripcion}` : null
}

/** Enlace a una dirección ya absoluta (la aplicación, que es otro dominio). */
function enlaceAbsoluto(nombre: string, url: string, descripcion: string): string {
  return `- [${nombre}](${url}): ${descripcion}`
}

function lista(titulo: string, lineas: (string | null)[]): string {
  const utiles = lineas.filter((linea): linea is string => linea !== null)
  if (utiles.length === 0) return ""
  return [`## ${titulo}`, "", ...utiles, ""].join("\n")
}

/** Las dos versiones de este mismo documento, la corta y la larga. */
function seccionDocumentos(t: Traductores): string {
  return lista("Documentos", [
    enlace(
      "El sitio completo en texto plano",
      rutasMaquina.llmsFull,
      "todo lo que sigue en esta página, con los precios de cada país y las preguntas frecuentes enteras"
    ),
    enlace(
      "Mapa del sitio",
      rutasMaquina.sitemap,
      "las direcciones de las páginas, en los dos idiomas"
    ),
    // Con el idioma dentro: `/` no es una página, es la redirección que resuelve
    // el proxy — un enlace ahí cuesta un salto de más.
    enlace(
      "Portada",
      getPathname({ href: rutas.inicio, locale: routing.defaultLocale }),
      t.identidad("descripcionCorta")
    ),
  ])
}

/**
 * Las páginas del sitio, en el idioma de referencia.
 *
 * Salen de `SECCIONES`, que es la misma lista que ordena la cabecera y el pie:
 * una página nueva aparece aquí sola. Antes este archivo contaba el contenido
 * pero no decía en qué dirección vive cada parte.
 */
function seccionPaginas(t: Traductores): string {
  const paginas: Record<(typeof SECCIONES)[number], { nombre: string; que: string }> = {
    producto: { nombre: t.producto("titulo"), que: t.producto("entrada") },
    vistaPrevia: { nombre: t.vistaPrevia("titulo"), que: t.vistaPrevia("entrada") },
    precios: { nombre: t.precios("titulo"), que: t.precios("entrada") },
    preguntas: { nombre: t.preguntas("titulo"), que: t.preguntas("entrada") },
  }

  return lista(
    "Páginas",
    SECCIONES.map((clave) =>
      enlace(
        paginas[clave].nombre,
        getPathname({ href: rutas[clave], locale: routing.defaultLocale }),
        paginas[clave].que
      )
    )
  )
}

/** El mismo sitio en los otros idiomas. La ficha del producto es la misma. */
function seccionOtrosIdiomas(): string {
  return lista(
    "Otros idiomas",
    routing.locales
      .filter((idioma) => idioma !== routing.defaultLocale)
      .map((idioma) =>
        enlace(
          `Barion en ${nombresDeIdioma[idioma]}`,
          getPathname({ href: rutas.inicio, locale: idioma }),
          "el mismo sitio, traducido"
        )
      )
  )
}

/** La aplicación es OTRO dominio: sus direcciones ya son absolutas. */
function seccionAplicacion(): string {
  return lista("Empezar", [
    enlaceAbsoluto(
      "Crear una barbería",
      rutasApp.registro,
      "el alta, con 7 días de prueba y sin tarjeta"
    ),
    enlaceAbsoluto("Entrar al panel", rutasApp.entrar, "para quien ya tiene cuenta"),
    enlaceAbsoluto("Contacto", `mailto:${CORREO_CONTACTO}`, "el canal comercial y de soporte"),
  ])
}

function seccionLegal(): string {
  const enIdiomaBase = (clave: "terminos" | "privacidad" | "cookies") =>
    getPathname({ href: rutas[clave], locale: routing.defaultLocale })

  return lista("Legal", [
    enlace(
      "Términos y condiciones",
      enIdiomaBase("terminos"),
      "qué se contrata, cómo se cobra, cómo se cancela y qué pasa con los datos después"
    ),
    enlace(
      "Política de privacidad",
      enIdiomaBase("privacidad"),
      "qué datos personales se tratan, con quién se comparten y cómo se ejercen los derechos"
    ),
    enlace(
      "Política de cookies",
      enIdiomaBase("cookies"),
      "qué se guarda en el navegador, para qué y cuánto dura"
    ),
  ])
}
