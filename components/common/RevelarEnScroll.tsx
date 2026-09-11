"use client"

import { motion, type Variants } from "motion/react"
import { RECORRIDO_REVELAR, TRANSICION_REVELAR, VISTA_REVELAR } from "@/lib/movimiento"
import { cn } from "@/lib/utils"

/**
 * Los recorridos posibles. **Solo verticales**, y no es un olvido.
 *
 * Había `izquierda` y `derecha`, que arrancaban con el bloque desplazado 32 px
 * en horizontal. En el teléfono esos bloques ocupan el ancho entero, así que
 * hasta que se animaban asomaban por el borde derecho y le daban a la página un
 * scroll horizontal. Un bloque que entra de lado tampoco dice nada que no diga
 * uno que sube.
 */
const estados = {
  subir: {
    oculto: { opacity: 0, y: RECORRIDO_REVELAR },
    visible: { opacity: 1, y: 0 },
  },
  zoom: {
    oculto: { opacity: 0, y: RECORRIDO_REVELAR / 2, scale: 0.985 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  /** Sin desplazamiento: para lo que aparece DENTRO de algo que ya está quieto (una fila nueva). */
  fundir: {
    oculto: { opacity: 0 },
    visible: { opacity: 1 },
  },
} as const

interface RevelarEnScrollProps {
  children: React.ReactNode
  recorrido?: keyof typeof estados
  /** Segundos de espera — para escalonar hermanos sin anidar contenedores. */
  retardo?: number
  /**
   * Qué elemento se pinta. `li` cuando el envoltorio va DENTRO de una lista.
   *
   * Sin esto, animar los elementos de una `<ol>` metía un `<div>` entre la lista
   * y sus `<li>`: la lista pasaba a tener hijos que no son elementos de lista y
   * los `<li>` a no tener padre válido. Dos auditorías de accesibilidad lo
   * señalaban, y con razón — para un lector de pantalla dejaba de ser «una lista
   * de tres pasos» y pasaba a ser texto suelto.
   *
   * El envoltorio no se mete en medio: ES el elemento de la lista.
   */
  como?: "div" | "li"
  className?: string
}

/**
 * Aparición al entrar en pantalla, UNA vez (`once`): un bloque que se reanima
 * cada vez que pasa por el viewport marea y roba atención al contenido.
 *
 * Solo `transform` y `opacity`, con la receta de `lib/movimiento.ts`, y bajo el
 * `MotionConfig reducedMotion="user"` del árbol — quien pida menos movimiento ve
 * el contenido fundirse en su sitio, sin desplazarse.
 *
 * **El retardo va DENTRO de la variante.** Motion usa la transición de la
 * variante y descarta la del componente, así que un `delay` pasado por
 * `transition` no llegaba nunca: los hermanos que tenían que escalonarse
 * entraban a la vez.
 */
export function RevelarEnScroll({
  children,
  recorrido = "subir",
  retardo = 0,
  className,
  como = "div",
}: RevelarEnScrollProps) {
  const Envoltorio = como === "li" ? motion.li : motion.div
  const { oculto, visible } = estados[recorrido]
  const variantes: Variants = {
    oculto,
    visible: { ...visible, transition: { ...TRANSICION_REVELAR, delay: retardo } },
  }

  return (
    <Envoltorio
      className={cn(className)}
      variants={variantes}
      initial="oculto"
      whileInView="visible"
      viewport={VISTA_REVELAR}
    >
      {children}
    </Envoltorio>
  )
}
