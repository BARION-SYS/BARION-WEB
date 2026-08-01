import { regiones, type CodigoRegion } from "@/config/regiones"

/**
 * Identidad del sitio en un solo sitio.
 *
 * El nombre, el titular y la descripción se repiten en cinco superficies que
 * tienen que decir LO MISMO: la etiqueta `<title>`, la descripción del buscador,
 * la tarjeta que se ve al compartir el enlace, el JSON-LD que leen buscadores y
 * modelos, y el `/llms.txt`. Escribirlos en cada archivo garantiza que a la
 * tercera edición ya no coinciden — y un sitio que se describe distinto en cada
 * canal es un sitio del que nadie se fía.
 */

export const NOMBRE_SITIO = "Barion"

/**
 * Título de la portada. Marca primero porque es la que hay que fijar, y detrás
 * lo que de verdad se busca: nadie teclea «Barion» todavía, teclea «software
 * para barberías». Bajo 60 caracteres para que el buscador no lo corte.
 */
export const TITULO_INICIO = "Barion — Software de gestión para barberías"

/** Cualquier página que no sea la portada hereda esta forma. */
export const PLANTILLA_TITULO = "%s · Barion"

/**
 * Descripción del buscador y de la tarjeta social. ~150 caracteres: por encima
 * de 160 se trunca, y lo que se corta siempre es el final, que es donde va la
 * llamada a la acción.
 */
export const DESCRIPCION =
  "Software de gestión para barberías: agenda con reservas en línea, ficha de clientes, comisiones por barbero y nómina. 15 días de prueba, sin tarjeta."

/** Versión corta para donde el espacio manda (Twitter/X, pies, resúmenes). */
export const DESCRIPCION_CORTA =
  "Agenda, clientes, equipo y nómina de tu barbería en un solo sitio. Tus clientes reservan solos desde el móvil."

/**
 * Frase de una línea para modelos de lenguaje: qué es, para quién y dónde.
 * Es la primera línea del `/llms.txt` y la que se cita cuando alguien pregunta
 * «¿qué es Barion?» a un asistente.
 */
export const RESUMEN_IA =
  "Barion es un SaaS multi-tenant de gestión para barberías —citas, agenda, clientes, equipo, comisiones y nómina— con un escaparate público donde los clientes de cada barbería reservan solos. Opera en Colombia, Estados Unidos y España."

/**
 * Palabras clave. No las usa Google para posicionar desde 2009, pero sí las
 * leen buscadores menores y modelos que resumen la página, y cuestan cero.
 * Son las que un dueño de barbería teclea de verdad, no las que suenan bien.
 */
export const PALABRAS_CLAVE = [
  "software para barberías",
  "programa para barberías",
  "software de gestión para barberías",
  "agenda para barbería",
  "sistema de reservas para barbería",
  "app de citas para barbería",
  "gestión de citas barbería",
  "comisiones de barberos",
  "nómina de barbería",
  "software barbería Colombia",
  "software barbería España",
  "barbershop software",
]

export const IDIOMA = "es"

/** Locale de la tarjeta social. Colombia es la región base del producto. */
export const LOCALE_OG = "es_CO"

/**
 * La sala del hero, en su versión nocturna: es la única imagen del sitio con
 * proporción social (3:2). Se declara la oscura porque la tarjeta se ve casi
 * siempre dentro de una aplicación de mensajería, donde el fondo del hilo es
 * oscuro más veces que claro.
 */
export const IMAGEN_SOCIAL = {
  url: "/assets/barion-hero-dark.webp",
  width: 1535,
  height: 1024,
  alt: "Barion — panel de gestión para barberías con la agenda del día",
} as const

/** Logotipo en absoluto para el JSON-LD (la variante clara, sobre fondo claro). */
export const LOGO_SOCIAL = "/barion-logo-light.webp"

/** Dónde opera Barion, derivado de las regiones: agregar un país las actualiza. */
export const PAISES_SERVIDOS = Object.keys(regiones) as CodigoRegion[]
