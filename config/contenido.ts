import {
  BarChart3,
  Building2,
  CalendarCheck,
  Clock3,
  Download,
  HeartHandshake,
  Link2,
  QrCode,
  Scissors,
  ShieldCheck,
  Smartphone,
  UserCog,
  type LucideIcon,
} from "lucide-react"

/**
 * La ESTRUCTURA del contenido: qué bloques hay, en qué orden y con qué icono.
 * El texto de cada uno vive en `constants/textos/`, uno por idioma.
 *
 * ── Por qué se parten en dos archivos ───────────────────────────────────────
 * Un icono no se traduce y un orden tampoco. Si vivieran dentro del diccionario
 * habría que repetirlos en cada idioma, y el día que se reordenen los bloques en
 * español el inglés se quedaría con el orden viejo sin que nada avise.
 *
 * ── Por qué son claves y no listas ──────────────────────────────────────────
 * Todo lo de aquí es una lista de claves literales, y el diccionario las declara
 * como `Record<Clave, …>`. Eso es lo que hace que **un idioma incompleto no
 * compile**: con listas paralelas, `en` podría traer tres bloques donde `es`
 * tiene cuatro y el sitio se publicaría con un hueco. Es el mismo criterio por
 * el que los diccionarios son `.ts` y no `.json`.
 */

// ── Producto: los tres bloques de valor ─────────────────────────────────────
// Tres. Ni uno más: lo que se dice de todo no se recuerda de nada.
export const CLAVES_BLOQUE = ["agenda", "clientes", "comisiones"] as const
export type ClaveBloque = (typeof CLAVES_BLOQUE)[number]

export const iconosBloque: Record<ClaveBloque, LucideIcon> = {
  agenda: CalendarCheck,
  clientes: HeartHandshake,
  comisiones: Scissors,
}

// ── Producto: lo que no cabe en tres bloques pero decide una compra ─────────
export const CLAVES_CAPACIDAD = [
  "qr",
  "sedes",
  "roles",
  "panelBarbero",
  "estadisticas",
  "exportar",
  "aislamiento",
] as const
export type ClaveCapacidad = (typeof CLAVES_CAPACIDAD)[number]

export const iconosCapacidad: Record<ClaveCapacidad, LucideIcon> = {
  qr: QrCode,
  sedes: Building2,
  roles: UserCog,
  panelBarbero: Smartphone,
  estadisticas: BarChart3,
  exportar: Download,
  aislamiento: ShieldCheck,
}

// ── Cómo llega una cita, en el orden en que ocurre ──────────────────────────
export const CLAVES_PASO = ["escaparate", "reserva", "agenda"] as const
export type ClavePaso = (typeof CLAVES_PASO)[number]

// ── Qué trae CUALQUIER plan ─────────────────────────────────────────────────
export const CLAVES_GARANTIA = ["escaparate", "panelBarbero", "exportar", "permanencia"] as const
export type ClaveGarantia = (typeof CLAVES_GARANTIA)[number]

export const iconosGarantia: Record<ClaveGarantia, LucideIcon> = {
  escaparate: CalendarCheck,
  panelBarbero: Smartphone,
  exportar: Download,
  permanencia: ShieldCheck,
}

// ── Puesta en marcha, en el cierre ──────────────────────────────────────────
export const CLAVES_ARRANQUE = ["crear", "cargar", "compartir"] as const
export type ClaveArranque = (typeof CLAVES_ARRANQUE)[number]

export const iconosArranque: Record<ClaveArranque, LucideIcon> = {
  crear: Clock3,
  cargar: Scissors,
  compartir: Link2,
}

/**
 * ── Las preguntas frecuentes ────────────────────────────────────────────────
 *
 * Los grupos y **qué preguntas lleva cada uno, en qué orden** viven aquí; el
 * texto, en el diccionario. Así reordenar o mover una pregunta de grupo es un
 * cambio en un solo archivo, y añadir una sin traducirla no compila.
 */
export const CLAVES_PREGUNTA = [
  "queEs",
  "queNecesito",
  "cuantoTardo",
  "pruebaTarjeta",
  "trabajoSolo",
  "comoReservan",
  "mismaHora",
  "recordatorio",
  "mensajeria",
  "cobroClientes",
  "verEquipo",
  "variasSedes",
  "moneda",
  "permanencia",
  "llevarDatos",
  "aislamiento",
  "cambioPlan",
  "directorio",
] as const
export type ClavePregunta = (typeof CLAVES_PREGUNTA)[number]

export const CLAVES_GRUPO_PREGUNTAS = ["empezar", "funcionamiento", "precioDatos"] as const
export type ClaveGrupoPreguntas = (typeof CLAVES_GRUPO_PREGUNTAS)[number]

export const preguntasPorGrupo: Record<ClaveGrupoPreguntas, readonly ClavePregunta[]> = {
  empezar: ["queEs", "queNecesito", "cuantoTardo", "pruebaTarjeta", "trabajoSolo"],
  funcionamiento: [
    "comoReservan",
    "mismaHora",
    "recordatorio",
    "mensajeria",
    "cobroClientes",
    "verEquipo",
    "variasSedes",
  ],
  precioDatos: ["moneda", "permanencia", "llevarDatos", "aislamiento", "cambioPlan", "directorio"],
}

/**
 * ── Las funciones que publica la API, dichas para quien compra ──────────────
 *
 * La API es dueña de lo que un plan ES —cuánto cuesta, cuántas sedes admite, qué
 * funciones habilita—; esto es cómo se CUENTA, y cambia por razones distintas.
 * En la base, `funciones` son **banderas de producto** (`{ campanas: true }`) de
 * las que depende si el módulo está encendido: convertirlas en frases ataría un
 * cambio de redacción a la lógica de negocio, y el día que alguien «mejore el
 * copy» apagaría una función.
 *
 * La lista es la de claves conocidas. Una que la API publique y no esté aquí se
 * enseña con su clave: desaparecer es lo único que el visitante no puede notar.
 */
export const CLAVES_FUNCION = [
  "agenda",
  "portal",
  "recordatorios",
  "clientes",
  "comisiones",
  "campanas",
  "fidelidad",
  "listaEspera",
  "reportes",
  "multisede",
] as const
export type ClaveFuncion = (typeof CLAVES_FUNCION)[number]

/** Los planes que este sitio sabe describir, por su `codigo` en la API. */
export const CLAVES_PLAN = ["esencial", "pro"] as const
export type ClavePlan = (typeof CLAVES_PLAN)[number]

/** El que la tabla resalta. **Uno solo**: dos destacados no destacan. */
export const PLAN_DESTACADO: ClavePlan = "pro"

/** Señales del hero. Hechos comprobables hoy, nunca prueba social inventada. */
export const CLAVES_SENAL = ["rapido", "mercados", "sinInstalar"] as const
export type ClaveSenal = (typeof CLAVES_SENAL)[number]

/**
 * ¿Es una clave que este sitio sabe nombrar?
 *
 * Las funciones y los códigos de plan llegan **de la API**, así que son cadenas
 * cualesquiera hasta que alguien las comprueba. Estas dos guardas convierten esa
 * cadena en una clave del diccionario, y son lo que permite que el compilador
 * siga verificando el mensaje: sin ellas habría que apagar el tipado con un
 * `as`, que es apagar justo lo que avisa cuando se retira una clave.
 *
 * Lo que la API publique y aquí no esté **se sigue enseñando**, con su clave o
 * sin descripción: desaparecer es lo único que el visitante no puede notar.
 */
export function esClaveFuncion(valor: string): valor is ClaveFuncion {
  return (CLAVES_FUNCION as readonly string[]).includes(valor)
}

export function esClavePlan(valor: string): valor is ClavePlan {
  return (CLAVES_PLAN as readonly string[]).includes(valor)
}
