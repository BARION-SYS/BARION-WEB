import { CORREO_CONTACTO } from "@/config/rutas"

/**
 * Identidad del titular y versión del corpus legal.
 *
 * ── Por qué la versión vive aquí y no dentro de cada documento ───────────────
 * Lo que alguien acepta al darse de alta no es «los términos» a secas: son los
 * términos Y la política de privacidad que estaban publicados ESE día. Si cada
 * documento llevara su propia versión, la aceptación tendría que guardar tres
 * cadenas y nadie sabría cuál mirar cuando el texto cambie. Una sola versión
 * para los tres documentos convierte la pregunta «¿qué aceptó esta barbería?»
 * en una comparación de cadenas.
 *
 * **La aplicación guarda esta misma cadena** al crear una barbería
 * (`barberias.terminos_version`), y quien la escribe es la api desde su propia
 * constante: el navegador no decide qué versión aceptó. Cambiar el texto de
 * cualquiera de los tres documentos obliga a subir la versión **aquí y en
 * `BARION-API/src/common/legal/version.ts`**, que son los dos únicos sitios
 * donde está escrita.
 *
 * Formato de fecha porque es lo que se lee bien en una tabla de auditoría dos
 * años después: `v3` no dice nada, `2026-08-13` dice exactamente qué texto era.
 */
export const VERSION_LEGAL = "2026-08-13"

/** Desde cuándo rige esta versión. Se pinta en la cabecera de los tres documentos. */
export const VIGENTE_DESDE = "13 de agosto de 2026"

/**
 * Quién presta el servicio.
 *
 * ── Los campos en `null` no son un olvido ───────────────────────────────────
 * Razón social, identificación fiscal, domicilio y jurisdicción son datos que
 * **no están en ningún archivo de este sistema**: los tiene el titular y solo
 * él. Inventarlos sería peor que no publicarlos — un documento legal que se
 * identifica mal no protege a nadie y compromete a quien lo firma.
 *
 * Mientras estén en `null`, los documentos se publican identificando a Barion
 * por su nombre comercial y su correo, y **se omiten las secciones que
 * dependen de esos datos** (la ficha del titular y la ley aplicable) en vez de
 * publicarlas con un hueco. Rellenarlos aquí las hace aparecer solas.
 */
export interface IdentidadLegal {
  /** Nombre comercial. Es lo único que se puede afirmar sin más datos. */
  titular: string
  /** Denominación social completa del prestador. */
  razonSocial: string | null
  /** NIT (CO), CIF/NIF (ES) o EIN (US), con su etiqueta ya escrita. */
  identificacionFiscal: string | null
  /** Domicilio en una línea: calle, ciudad, país. */
  domicilio: string | null
  /**
   * País cuya ley rige el contrato y ante cuyos jueces se litiga. Va aparte del
   * domicilio porque no siempre coinciden y porque es la que se cita.
   */
  jurisdiccion: string | null
  /** Canal para ejercer derechos y para cualquier comunicación del contrato. */
  correo: string
}

export const IDENTIDAD_LEGAL: IdentidadLegal = {
  titular: "Barion",
  razonSocial: null,
  identificacionFiscal: null,
  domicilio: null,
  jurisdiccion: null,
  correo: CORREO_CONTACTO,
}

/**
 * Los terceros que tratan datos por cuenta de Barion, con nombre propio.
 *
 * Vive aquí y no dentro de un documento porque **se cita en dos**: la política
 * de privacidad los declara como destinatarios y el anexo de encargo de los
 * términos los declara como subencargados. Dos listas se desincronizan a la
 * primera alta de proveedor, y una lista de subencargados incompleta es
 * exactamente el incumplimiento que el anexo dice no cometer.
 */
export interface Subencargado {
  nombre: string
  papel: string
  datos: string
  donde: string
}

export const SUBENCARGADOS: Subencargado[] = [
  {
    nombre: "Wompi",
    papel: "Pasarela de pago de la suscripción a Barion",
    datos:
      "Nombre, correo, importe y referencia del cobro. La tarjeta se tokeniza en el navegador contra el dominio de la pasarela: a Barion nunca llega el número completo",
    donde: "Colombia",
  },
  {
    nombre: "Resend",
    papel:
      "Envío del correo transaccional (verificación, invitaciones, avisos de cobro, recordatorios de cita)",
    datos: "Nombre, dirección de correo y el contenido del mensaje",
    donde: "Estados Unidos",
  },
  {
    nombre: "Google",
    papel: "Identificación con «Continuar con Google», solo si se elige esa vía",
    datos: "Correo, nombre e identificador de la cuenta de Google",
    donde: "Estados Unidos",
  },
  {
    nombre: "Vercel",
    papel: "Analítica de uso de la aplicación",
    datos:
      "Página visitada, procedencia, tipo de dispositivo y país aproximado. No pone cookies ni identifica a la persona",
    donde: "Estados Unidos",
  },
  {
    nombre: "El proveedor de infraestructura donde se aloja Barion",
    papel: "Servidores y base de datos",
    datos: "Todos los datos del servicio, en reposo",
    donde: "Se declara al contratar",
  },
]
