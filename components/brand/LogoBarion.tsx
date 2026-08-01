"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useMontado } from "@/hooks/useMontado"
import { cn } from "@/lib/utils"

/**
 * width/height = dimensiones reales del asset (ratio correcto, sin CLS); el
 * tamaño en pantalla lo controla la clase del consumidor.
 *
 * Cada tema tiene su medida porque los dos archivos NO miden lo mismo, y con
 * `w-auto` + una altura fija es el ratio quien decide el ancho: dar por bueno
 * el del claro deformaba el oscuro un 1,6 %. Al cambiar un asset hay que
 * volver a mirar aquí.
 */
const fuentes = {
  completo: {
    light: { src: "/barion-logo-light.webp", width: 941, height: 231 },
    dark: { src: "/barion-logo-dark.webp", width: 940, height: 230 },
  },
  icono: {
    light: { src: "/barion-icon-light.webp", width: 200, height: 244 },
    dark: { src: "/barion-icon-dark.webp", width: 200, height: 248 },
  },
} as const

interface LogoBarionProps {
  variante?: keyof typeof fuentes
  className?: string
  priority?: boolean
}

// Logo de marca según el tema activo — única fuente del asset en la UI.
export function LogoBarion({ variante = "completo", className, priority }: LogoBarionProps) {
  const { resolvedTheme } = useTheme()
  const montado = useMontado()

  const claro = montado && resolvedTheme === "light"
  const fuente = fuentes[variante][claro ? "light" : "dark"]

  return (
    <Image
      src={fuente.src}
      alt="Barion"
      width={fuente.width}
      height={fuente.height}
      priority={priority}
      className={cn("w-auto", className)}
    />
  )
}
