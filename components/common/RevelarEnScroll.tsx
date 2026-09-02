"use client"

import { motion, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

// Misma curva que el resto del sistema (spring 140/22), recorridos distintos.
const resorte = { type: "spring", stiffness: 140, damping: 22 } as const

const recorridos: Record<string, Variants> = {
  subir: {
    oculto: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: resorte },
  },
  izquierda: {
    oculto: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0, transition: resorte },
  },
  derecha: {
    oculto: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: resorte },
  },
  zoom: {
    oculto: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: resorte },
  },
}

interface RevelarEnScrollProps {
  children: React.ReactNode
  recorrido?: keyof typeof recorridos
  /** Segundos de espera — para escalonar hermanos sin anidar contenedores. */
  retardo?: number
  /** Cascada de los hijos directos que declaren `variants`. */
  cascada?: number
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
 * Solo `transform` y `opacity`, y bajo el `MotionConfig reducedMotion="user"`
 * del árbol — quien pida menos movimiento ve el contenido quieto y completo.
 */
export function RevelarEnScroll({
  children,
  recorrido = "subir",
  retardo = 0,
  cascada,
  className,
  como = "div",
}: RevelarEnScrollProps) {
  const Envoltorio = como === "li" ? motion.li : motion.div

  return (
    <Envoltorio
      className={cn(className)}
      variants={recorridos[recorrido]}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: retardo, ...(cascada ? { staggerChildren: cascada } : {}) }}
    >
      {children}
    </Envoltorio>
  )
}
