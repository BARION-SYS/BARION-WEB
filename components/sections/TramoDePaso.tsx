"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * El hilo entre dos pasos, que se llena de oro al bajar por la página.
 *
 * Va atado al DESPLAZAMIENTO y no a un temporizador: avanza lo que avanza quien
 * lee, así que la secuencia se cuenta al ritmo de la lectura en vez de pasar
 * sola mientras la vista todavía está en el título. El resorte encima solo
 * suaviza la rueda del ratón, que llega a saltos.
 *
 * Es lo único de la sección que necesita el cliente, y por eso es un componente
 * aparte: los pasos, su texto y la maqueta se siguen pintando en el servidor.
 *
 * Quien pide menos movimiento lo ve lleno desde el principio. El `MotionConfig`
 * del árbol no alcanza a un valor atado al scroll, y comprobarlo con
 * `useReducedMotion` pintaría en el cliente algo distinto de lo que mandó el
 * servidor; la regla de CSS no depende de hidratar.
 */
export function TramoDePaso({ className }: { className?: string }) {
  const tramo = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({ target: tramo, offset: ["start 85%", "end 55%"] })
  const avance = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 })

  return (
    <span
      ref={tramo}
      className={cn("relative block w-px overflow-hidden rounded-full bg-border", className)}
      aria-hidden
    >
      <motion.span
        className="absolute inset-0 origin-top bg-primary motion-reduce:transform-none!"
        style={{ scaleY: avance }}
      />
    </span>
  )
}
