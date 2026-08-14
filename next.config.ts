import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

/**
 * El plugin de next-intl. Conecta `i18n/request.ts` con el render: sin él,
 * `useTranslations()` no encuentra mensajes y toda página revienta pidiendo una
 * configuración que nadie le dio.
 */
const conIdiomas = createNextIntlPlugin("./i18n/request.ts")

// next.config corre en Node al arrancar — no puede importar config/env.ts (TS de la app).
// Todo valor configurable entra por variable de entorno, con default seguro.
const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const nextConfig: NextConfig = {
  /**
   * Salida autocontenida: `.next/standalone` trae el servidor y SOLO las
   * dependencias que el trazado encuentra usadas. Es lo que copia la etapa
   * `runner` del `Dockerfile` — sin esto, esa copia no existe y la imagen de
   * producción no se construye.
   */
  output: "standalone",

  /**
   * El optimizador SÍ se usa.
   *
   * Estaba apagado, y apagarlo en este sitio es caro: la fotografía del hero
   * son 1535×1024 y es el elemento que decide el LCP —la métrica que Google
   * mide y con la que ordena—. Con el optimizador, un móvil recibe la variante
   * de su ancho en vez de la de escritorio entera; sin él, todos descargan lo
   * mismo. `sharp` ya viene con Next (dependencia opcional) y entra en la
   * imagen de producción con `pnpm install`, así que no hay nada que añadir.
   *
   * AVIF primero: pesa ~30 % menos que webp en fotografía, y quien no lo
   * soporte recibe webp. Las dos se generan una vez y se cachean.
   */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Acceso en dev a través del proxy — sin esto Next bloquea el HMR y los assets de dev.
  ...(allowedDevOrigins?.length ? { allowedDevOrigins } : {}),
}

export default conIdiomas(nextConfig)
