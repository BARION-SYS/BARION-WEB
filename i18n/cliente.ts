import { getMessages } from "next-intl/server"
import type { Idioma } from "@/i18n/routing"

/**
 * Qué mensajes se le bajan al NAVEGADOR.
 *
 * ── Por qué no todos ────────────────────────────────────────────────────────
 * `NextIntlClientProvider` sin `messages` manda el catálogo entero, y la mitad
 * no la usa nadie en el cliente: `identidad` y `paginas` son metadatos que se
 * resuelven en el servidor, `legal` son los tres documentos, y `preguntas`,
 * `cierre`, `vistaPrevia` y `pie` los pintan componentes de servidor. En una
 * página legal eso son decenas de kilobytes de texto viajando para nada.
 *
 * Este sitio existe para posicionar, y lo que tarda en pintar no vende: acotar
 * el payload no es una micro-optimización, es la misma decisión por la que aquí
 * no entran axios ni zustand en el bundle de la landing.
 *
 * ── Cómo se mantiene, que es lo delicado ────────────────────────────────────
 * Un componente cliente que pida un espacio que no esté en esta lista **falla en
 * ejecución**, no al compilar. Por eso la lista se saca midiendo y no de memoria:
 *
 *     grep -rl '"use client"' components | xargs grep -o 'useTranslations("[^"]*"'
 *
 * Al convertir un componente a cliente —o al añadir uno— se vuelve a mirar.
 */
const ESPACIOS_DEL_CLIENTE = [
  "navegacion", // Nav
  "tema", // ThemeToggle
  "idioma", // SelectorIdioma
  "hero", // Hero
  "producto", // ValorList
  "precios", // PreciosGrid, PlanCard, RegionSelect
  "regiones", // RegionSelect
  "maquetas", // HeroPanel, EscaparateDemo
] as const

/** Los mensajes que necesita el cliente, y solo esos. */
export async function mensajesDelCliente(locale: Idioma) {
  const todos = await getMessages({ locale })

  return Object.fromEntries(
    ESPACIOS_DEL_CLIENTE.filter((espacio) => espacio in todos).map((espacio) => [
      espacio,
      todos[espacio],
    ])
  )
}
