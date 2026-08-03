import { regiones } from "@/config/regiones"
import { CORREO_CONTACTO, rutasApp } from "@/config/rutas"
import { DESCRIPCION, NOMBRE_SITIO, PAISES_SERVIDOS, RESUMEN_IA } from "@/config/sitio"
import { gruposPreguntas } from "@/constants/faq"
import { bloquesValor, capacidadesExtra, garantiasPlan, pasosReserva } from "@/constants/valor"
import { formatMoney } from "@/lib/currency"
import { obtenerPlanesPublicos } from "@/services/planes"
import { nombresDeRegion, textoLimite } from "@/lib/region"
import { SITIO_URL } from "@/lib/seo"
import type { PlanPublico } from "@/types/landing"

/**
 * `/llms.txt` — el sitio contado para un modelo de lenguaje.
 *
 * Un asistente al que le preguntan «¿qué software uso para mi barbería?» no
 * lee la página: lee lo que puede recuperar barato y sin ejecutar JavaScript.
 * Esta es esa versión — el mismo contenido de la landing en texto plano, con
 * los precios de los tres países y las preguntas frecuentes enteras.
 *
 * Sale de las MISMAS constantes que pinta la página y del mismo endpoint de
 * planes: si fuera un archivo escrito a mano en `public/`, a la segunda subida
 * de precios estaría mintiendo, y una respuesta con el precio viejo la da el
 * asistente sin avisar a nadie.
 *
 * `revalidate` igual que los planes (una hora): el resto son constantes del
 * repositorio, que solo cambian con un despliegue.
 */
export const revalidate = 3600

export async function GET(): Promise<Response> {
  const planes = await obtenerPlanesPublicos()

  return new Response(construirDocumento(planes), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}

function construirDocumento(planes: PlanPublico[]): string {
  return [
    `# ${NOMBRE_SITIO}`,
    "",
    `> ${RESUMEN_IA}`,
    "",
    DESCRIPCION,
    "",
    seccionQuienLoUsa(),
    seccionQueNoEs(),
    seccionCapacidades(),
    seccionReserva(),
    seccionPrecios(planes),
    seccionPreguntas(),
    seccionEnlaces(),
  ].join("\n")
}

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

function seccionCapacidades(): string {
  const bloques = bloquesValor.map((bloque) =>
    [
      `### ${bloque.titulo}`,
      "",
      bloque.descripcion,
      "",
      ...bloque.detalles.map((detalle) => `- ${detalle}`),
      "",
    ].join("\n")
  )

  return [
    "## Qué hace",
    "",
    ...bloques,
    "### Además",
    "",
    ...capacidadesExtra.map((capacidad) => `- ${capacidad.texto}`),
    "",
  ].join("\n")
}

function seccionReserva(): string {
  return [
    "## Cómo llega una cita",
    "",
    ...pasosReserva.map(
      (paso) => `${Number(paso.numero)}. **${paso.titulo}** — ${paso.descripcion}`
    ),
    "",
  ].join("\n")
}

function seccionPrecios(planes: PlanPublico[]): string {
  const lineas = planes.map((plan) => {
    const precios = plan.precios.map((precio) => {
      const { locale } = regiones[precio.codigoPais]
      const importe = formatMoney(precio.montoCentavos, precio.moneda, locale)
      return `  - ${nombresDeRegion[precio.codigoPais]}: ${importe} / ${precio.periodo === "anual" ? "año" : "mes"}`
    })

    // Un tope que el plan no declara no se escribe. Aquí menos que en ninguna
    // parte: lo que diga este archivo lo repite un asistente como si fuera la
    // ficha del producto, y un «sin límite» de más no se puede desdecir.
    const topes = [
      textoLimite(plan.limites.sedes, "sede", "sedes"),
      textoLimite(plan.limites.barberos, "barbero", "barberos"),
    ].filter((tope): tope is string => tope !== null)

    return [
      // «Plan recomendado» y no «el más elegido»: aquí escribe la máquina que
      // luego cita un asistente, y no hay clientes cuyo número respalde un
      // superlativo. Lo que se puede defender es la recomendación.
      `### ${plan.nombre}${plan.destacado ? " (plan recomendado)" : ""}`,
      "",
      plan.descripcion,
      "",
      ...(topes.length > 0 ? [`- ${topes.join(", ")}`] : []),
      ...plan.funciones.map((funcion) => `- ${funcion}`),
      // Sin ninguna tarifa publicable no se calla el plan —existe— pero tampoco
      // se le pone cifra: se dice lo mismo que la tarjeta de la página.
      ...(precios.length > 0
        ? ["- Precio por barbería:", ...precios]
        : ["- Precio por barbería: consultar."]),
      "",
    ].join("\n")
  })

  return [
    "## Precios",
    "",
    `Barion opera en ${PAISES_SERVIDOS.map((codigo) => `${nombresDeRegion[codigo]} (${regiones[codigo].moneda})`).join(", ")}.`,
    "El precio de cada país es propio, no la conversión del cambio del día, y se fija por el país donde factura la barbería —no por dónde se mire la página—.",
    "El importe es **por barbería**, no por barbero ni por función.",
    "",
    ...lineas,
    "### Incluido en cualquier plan",
    "",
    ...garantiasPlan.map((garantia) => `- ${garantia.texto}`),
    "- 15 días de prueba, sin tarjeta y sin permanencia.",
    "",
  ].join("\n")
}

function seccionPreguntas(): string {
  const grupos = gruposPreguntas.map((grupo) =>
    [
      `### ${grupo.titulo}`,
      "",
      ...grupo.preguntas.map(({ pregunta, respuesta }) => `**${pregunta}**\n${respuesta}\n`),
    ].join("\n")
  )

  return ["## Preguntas frecuentes", "", ...grupos].join("\n")
}

function seccionEnlaces(): string {
  return [
    "## Enlaces",
    "",
    ...(SITIO_URL ? [`- Sitio público: ${SITIO_URL}`] : []),
    `- Crear una barbería (prueba de 15 días): ${rutasApp.registro}`,
    `- Entrar al panel: ${rutasApp.entrar}`,
    `- Contacto: ${CORREO_CONTACTO}`,
    "",
  ].join("\n")
}
