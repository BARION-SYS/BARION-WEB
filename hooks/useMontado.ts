"use client"

import { useSyncExternalStore } from "react"

// Nadie emite cambios: el valor pasa de servidor a cliente una sola vez.
const suscribir = () => () => {}

/**
 * `false` mientras se renderiza en el servidor y en la primera pasada del
 * cliente; `true` a partir de ahí.
 *
 * Lo necesita todo lo que depende del tema: el tema real vive en el navegador
 * (clase en `<html>`), así que pintar el valor definitivo en el primer render
 * rompería la hidratación. El guard clásico es `useState` + `useEffect`, pero
 * eso es un `setState` dentro de un efecto —una segunda pasada de render que el
 * lint marca, con razón—. `useSyncExternalStore` da lo mismo con dos snapshots
 * distintos, sin efecto y sin render de más.
 */
export function useMontado(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => true,
    () => false
  )
}
