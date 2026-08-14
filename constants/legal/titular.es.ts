import type { EtiquetasTitular } from "@/constants/legal/tipos"

/**
 * Los rótulos de la ficha del titular en español.
 *
 * Vive aparte de los tres documentos porque los tres la usan igual: es
 * literalmente el mismo apartado, y el que más depende de los datos que hoy
 * faltan en `IDENTIDAD_LEGAL`. Cuando se rellenen, las tres páginas lo recogen a
 * la vez.
 */
export const etiquetasTitularEs: EtiquetasTitular = {
  titulo: "Quién presta el servicio",
  entradilla:
    "Barion es un servicio de software en línea para la gestión de barberías. En este documento, «Barion» o «nosotros» se refiere al titular del servicio, y «tú» o «la barbería» a la persona o empresa que lo contrata. El correo de contacto es el canal para cualquier comunicación relativa a estos documentos, incluido el ejercicio de derechos sobre datos personales.",
  titular: "Titular del servicio",
  razonSocial: "Razón social",
  identificacionFiscal: "Identificación fiscal",
  domicilio: "Domicilio",
  correo: "Correo de contacto",
}
