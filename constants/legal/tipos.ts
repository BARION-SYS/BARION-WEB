/**
 * La forma de un documento legal, para que los tres se escriban igual.
 *
 * ── Por qué datos y no JSX ──────────────────────────────────────────────────
 * Es el mismo criterio de `constants/faq.ts`: el texto tiene más de un destino
 * —la página, el índice lateral que se construye solo con los títulos, y el día
 * que haga falta una versión imprimible o un correo con el cambio de términos—.
 * Un `<p>` escrito a mano dentro del contenido ata el texto a UNA presentación
 * y obliga a mantener dos copias en cuanto aparece la segunda.
 *
 * ── Por qué el documento es una FUNCIÓN de la identidad ─────────────────────
 * Razón social, domicilio y jurisdicción no están en este repositorio (ver
 * `config/legal.ts`). Un documento que los recibe puede **omitir** lo que no
 * puede afirmar en vez de publicar un hueco, y aparece solo el día que se
 * rellenan. Es el mismo patrón que los schemas de zod del panel, que reciben el
 * diccionario en vez de leer una constante global.
 */
import type { IdentidadLegal } from "@/config/legal"

export type BloqueLegal =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "lista"; items: string[] }
  /** Para lo que se lee comparando: subencargados, cookies, plazos. */
  | { tipo: "tabla"; cabecera: string[]; filas: string[][] }

export interface SeccionLegal {
  /**
   * Ancla de la sección. Es un id real del DOM y el destino del índice, así que
   * cambiarlo rompe cualquier enlace que alguien haya guardado a un apartado
   * concreto — se cambia solo si el apartado deja de existir.
   */
  id: string
  titulo: string
  bloques: BloqueLegal[]
}

export interface DocumentoLegal {
  titulo: string
  /** Una o dos frases: de qué va y a quién le aplica. Se pinta bajo el título. */
  entradilla: string
  secciones: SeccionLegal[]
}

/** Todo documento se construye igual: recibe la identidad y devuelve el texto. */
export type ConstructorDocumento = (identidad: IdentidadLegal) => DocumentoLegal

/** Los rótulos de la ficha del titular, que es el único apartado compartido. */
export interface EtiquetasTitular {
  titulo: string
  entradilla: string
  titular: string
  razonSocial: string
  identificacionFiscal: string
  domicilio: string
  correo: string
}

/**
 * La ficha del titular, que los tres documentos abren igual.
 *
 * Se escribe una vez porque es literalmente el mismo apartado en los tres, y
 * porque es el que más depende de datos que hoy faltan: cuando se rellene
 * `IDENTIDAD_LEGAL`, las tres páginas lo recogen a la vez.
 */
export function seccionTitular(
  identidad: IdentidadLegal,
  etiquetas: EtiquetasTitular
): SeccionLegal {
  const items = [
    `${etiquetas.titular}: ${identidad.titular}.`,
    ...(identidad.razonSocial ? [`${etiquetas.razonSocial}: ${identidad.razonSocial}.`] : []),
    ...(identidad.identificacionFiscal
      ? [`${etiquetas.identificacionFiscal}: ${identidad.identificacionFiscal}.`]
      : []),
    ...(identidad.domicilio ? [`${etiquetas.domicilio}: ${identidad.domicilio}.`] : []),
    `${etiquetas.correo}: ${identidad.correo}.`,
  ]

  return {
    id: "titular",
    titulo: etiquetas.titulo,
    bloques: [
      { tipo: "parrafo", texto: etiquetas.entradilla },
      { tipo: "lista", items },
    ],
  }
}
