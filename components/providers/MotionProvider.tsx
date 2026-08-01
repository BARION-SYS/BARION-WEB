"use client"

import { MotionConfig } from "motion/react"

/**
 * `MotionConfig` con `reducedMotion="user"` para un árbol entero — no anidar
 * otro dentro.
 *
 * Existe como provider porque `motion/react` no marca sus módulos como cliente:
 * usarlo directamente desde un layout de servidor (el de la landing lo es, para
 * poder renderizar los precios en el HTML) revienta el render. Aquí queda el
 * único límite de cliente que hace falta, y el layout sigue siendo servidor.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
