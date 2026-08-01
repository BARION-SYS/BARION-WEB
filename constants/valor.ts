import {
  BarChart3,
  Building2,
  CalendarCheck,
  Download,
  HeartHandshake,
  QrCode,
  Scissors,
  ShieldCheck,
  Smartphone,
  UserCog,
  type LucideIcon,
} from "lucide-react"

export interface BloqueValor {
  icono: LucideIcon
  titulo: string
  descripcion: string
  /** Lo concreto: qué hace exactamente. Sin esto el bloque es un eslogan. */
  detalles: string[]
}

// Tres bloques. Ni uno más: lo que se dice de todo no se recuerda de nada.
export const bloquesValor: BloqueValor[] = [
  {
    icono: CalendarCheck,
    titulo: "La agenda que no se pisa",
    descripcion:
      "El cliente reserva solo, desde el móvil y sin llamar. Dos citas nunca caen encima de la misma silla.",
    detalles: [
      "Reserva a cualquier hora desde tu enlace público",
      "El solape lo rechaza el sistema, no tu memoria",
      "Jornadas, descansos y ausencias por barbero",
      "Recordatorio automático antes de cada cita",
    ],
  },
  {
    icono: HeartHandshake,
    titulo: "Clientes que vuelven",
    descripcion:
      "El del cumpleaños, el que lleva tres meses sin aparecer y el que siempre pide al mismo barbero. Barion se acuerda por ti.",
    detalles: [
      "Ficha con historial, notas y preferencias",
      "Aviso de cumpleaños y de cliente dormido",
      "Barbero favorito recordado en cada reserva",
      "Segmentos para hablarle a quien toca",
    ],
  },
  {
    icono: Scissors,
    titulo: "Cuánto se lleva cada uno",
    descripcion:
      "Comisiones, producción y liquidación por barbero. Se acabó cuadrar la semana con un cuaderno.",
    detalles: [
      "Comisión por barbero congelada en cada cita",
      "Producción del día, la semana y el mes",
      "Liquidación lista para pagar, sin recalcular",
      "El barbero ve lo suyo, y solo lo suyo",
    ],
  },
]

export interface CapacidadExtra {
  icono: LucideIcon
  texto: string
}

// Lo que no cabe en tres bloques pero decide una compra. Todo existe hoy.
export const capacidadesExtra: CapacidadExtra[] = [
  { icono: QrCode, texto: "QR para el local" },
  { icono: Building2, texto: "Varias sedes" },
  { icono: UserCog, texto: "Roles y permisos" },
  { icono: Smartphone, texto: "Panel del barbero" },
  { icono: BarChart3, texto: "Estadísticas de ocupación" },
  { icono: Download, texto: "Tus datos, exportables" },
  { icono: ShieldCheck, texto: "Cada barbería aislada" },
]

export interface PasoReserva {
  numero: string
  titulo: string
  descripcion: string
}

// Cómo llega una cita, contado en el orden en que ocurre.
export const pasosReserva: PasoReserva[] = [
  {
    numero: "01",
    titulo: "Publicas tu escaparate",
    descripcion:
      "Tu barbería tiene su propia dirección y su propio color. La compartes por WhatsApp, en tu perfil o con el QR del local.",
  },
  {
    numero: "02",
    titulo: "El cliente elige y reserva",
    descripcion:
      "Servicio, barbero y hora libre, desde el móvil y sin instalar nada. Confirma su teléfono y la cita queda hecha.",
  },
  {
    numero: "03",
    titulo: "Aparece en tu agenda",
    descripcion:
      "Sin llamadas ni mensajes cruzados. El recordatorio sale solo y la silla se bloquea al instante.",
  },
]

export interface GarantiaPlan {
  icono: LucideIcon
  texto: string
}

// Lo que trae CUALQUIER plan. Va bajo los precios porque es lo que se pregunta
// justo después de mirarlos.
export const garantiasPlan: GarantiaPlan[] = [
  { icono: CalendarCheck, texto: "Escaparate público y reservas" },
  { icono: Smartphone, texto: "Panel del barbero incluido" },
  { icono: Download, texto: "Exportas tus datos cuando quieras" },
  { icono: ShieldCheck, texto: "Sin permanencia: te vas cuando quieras" },
]
