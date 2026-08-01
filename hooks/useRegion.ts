"use client"

import { useCallback, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { CodigoRegion } from "@/config/regiones"
import { COOKIE_REGION } from "@/lib/region"

/** La elección dura un año: es una preferencia, no una sesión. */
const UN_ANO_EN_SEGUNDOS = 60 * 60 * 24 * 365

/**
 * Cambiar el país que se está mirando.
 *
 * Vive aparte del selector porque son dos responsabilidades distintas: el
 * componente decide cómo se ve una lista de países, y esto decide QUÉ pasa al
 * elegir uno —dónde se guarda, cuánto dura y quién vuelve a pintar—. El día que
 * haya un segundo sitio donde cambiar de país (el pie, un aviso), la regla no
 * se copia.
 *
 * El cambio lo aplica el SERVIDOR: se escribe la cookie y se le pide que vuelva
 * a renderizar. Recalcular los precios aquí sería una segunda verdad, y la
 * buena es la que ve el buscador. `useTransition` da el estado de espera de esa
 * ida y vuelta, que sin él no se puede enseñar.
 */
export function useRegion() {
  const router = useRouter()
  const [cambiando, iniciarCambio] = useTransition()

  const elegirRegion = useCallback(
    (codigo: CodigoRegion) => {
      // `SameSite=Lax` porque solo se lee al navegar dentro del sitio, y sin
      // `Secure` a propósito: en desarrollo no hay HTTPS y la cookie se
      // descartaría en silencio, que es el fallo más difícil de ver.
      document.cookie = `${COOKIE_REGION}=${codigo}; path=/; max-age=${UN_ANO_EN_SEGUNDOS}; SameSite=Lax`
      iniciarCambio(() => router.refresh())
    },
    [router]
  )

  return { elegirRegion, cambiando }
}
