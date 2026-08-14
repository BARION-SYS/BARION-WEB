import { IDIOMA_DEFECTO, type Idioma } from "@/config/idiomas"
import { IDENTIDAD_LEGAL } from "@/config/legal"
import { cookies } from "@/constants/legal/cookies"
import { privacidad } from "@/constants/legal/privacidad"
import { terminos } from "@/constants/legal/terminos"
import type { DocumentoLegal } from "@/constants/legal/tipos"

/** Los tres documentos, por su clave de ruta. */
export type ClaveDocumento = "terminos" | "privacidad" | "cookies"

const constructores = {
  terminos,
  privacidad,
  cookies,
} as const

/**
 * El documento legal que toca, en el idioma que toca.
 *
 * ── Por qué hoy devuelve siempre el español ─────────────────────────────────
 * Porque hoy **solo existe en español**, y traducirlo a medias sería peor que no
 * traducirlo: un texto legal a medio traducir no dice lo mismo, y en un contrato
 * eso no es un matiz. Mientras tanto, el sitio en inglés sirve el texto español
 * **encabezado por un aviso** que dice cuál es la versión que rige
 * (`avisoIdiomaLegal`), que es exactamente lo que hace un contrato con
 * traducción de cortesía.
 *
 * ── Qué falta para tenerlo en inglés ────────────────────────────────────────
 * Un segundo mapa de constructores, aquí, con la misma forma. La estructura ya
 * lo admite: los documentos son datos y cada uno se construye a partir de la
 * identidad, así que la versión inglesa es otro archivo de `constants/legal/`
 * y una entrada más en este mapa. Nada de lo que hay alrededor cambia.
 */
export function documentoLegal(idioma: Idioma, clave: ClaveDocumento): DocumentoLegal {
  void idioma
  return constructores[clave](IDENTIDAD_LEGAL)
}

/** En qué idioma están redactados de verdad. Lo usa el aviso de traducción. */
export const IDIOMA_DE_LOS_DOCUMENTOS: Idioma = IDIOMA_DEFECTO
