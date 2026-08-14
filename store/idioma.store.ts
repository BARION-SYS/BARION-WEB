"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { COOKIE_IDIOMA, type Idioma } from "@/i18n/routing"

/** Cuánto se recuerda la elección. Es una preferencia, no una sesión. */
const UN_ANO_EN_SEGUNDOS = 60 * 60 * 24 * 365

interface EstadoIdioma {
  /**
   * El idioma que esta persona eligió **a mano**. `null` mientras no haya
   * elegido ninguno, que no es lo mismo que «español»: distingue una preferencia
   * de un valor por defecto, y es lo que permite seguir negociando con el
   * navegador hasta que alguien decida.
   */
  elegido: Idioma | null
  fijar: (idioma: Idioma) => void
}

/**
 * La preferencia de idioma de este navegador.
 *
 * ── El store NO decide el idioma, y esto es lo importante ───────────────────
 * Lo decide la URL (`/es/…`, `/en/…`), y quien la resuelve para quien entra por
 * la puerta principal es el middleware, leyendo la **cookie**. Tiene que ser una
 * cookie porque el servidor no ve `localStorage`: una preferencia que viviera
 * solo en el store llegaría después del primer render —parpadeo garantizado— y
 * sería invisible para un buscador, que es tanto como no tener sitio en inglés.
 *
 * ── Entonces, ¿para qué el store? ───────────────────────────────────────────
 * Para dos cosas que la cookie no da:
 *
 *  · **Sobrevive a que se borren las cookies.** Es lo que hace que la elección
 *    aguante de verdad entre visitas, que es lo que se le pide a una preferencia.
 *  · **Es legible desde cualquier componente cliente** sin bajarla por props,
 *    igual que en el panel (`BARION-FRONT/store/idioma.store.ts`). El día que
 *    haya un segundo sitio donde cambiar de idioma —un aviso, el pie— no se
 *    copia la regla.
 *
 * `fijar` escribe **las dos**: el store y la cookie espejo. Escriben siempre el
 * mismo valor y en el mismo acto, así que no hay ventana en la que discrepen.
 * El middleware de next-intl escribe esa misma cookie al navegar a un idioma;
 * que coincidan es lo esperado, no una duplicación — uno la deja al elegir y el
 * otro al llegar.
 */
export const useIdiomaStore = create<EstadoIdioma>()(
  persist(
    (set) => ({
      elegido: null,
      fijar: (idioma) => {
        // El espejo que SÍ lee el servidor. Mismo nombre y misma duración que
        // declara `routing.localeCookie`: dos valores distintos aquí serían dos
        // preferencias, y ganaría la que llegara más tarde.
        //
        // Sin `Secure` a propósito: en desarrollo no hay HTTPS y la cookie se
        // descartaría en silencio, que es el fallo más difícil de ver.
        document.cookie = `${COOKIE_IDIOMA}=${idioma}; path=/; max-age=${UN_ANO_EN_SEGUNDOS}; SameSite=Lax`
        set({ elegido: idioma })
      },
    }),
    {
      name: "barion-idioma",
      // Solo la preferencia. `fijar` es comportamiento y persistirlo guardaría
      // una función muerta en `localStorage`.
      partialize: (estado) => ({ elegido: estado.elegido }),
    }
  )
)
