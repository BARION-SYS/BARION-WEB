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
}: RevelarEnScrollProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={recorridos[recorrido]}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: retardo, ...(cascada ? { staggerChildren: cascada } : {}) }}
    >
      {children}
    </motion.div>
  )
}
