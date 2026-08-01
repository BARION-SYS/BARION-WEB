import { z } from "zod"

/**
 * Variables que SÍ viajan al navegador.
 *
 * Todo lo que entre aquí acaba escrito en claro dentro de un `.js` que
 * cualquiera abre desde las herramientas del navegador — el prefijo
 * `NEXT_PUBLIC_` no es una etiqueta descriptiva, es la instrucción de
 * incrustarlo en el bundle. Por eso este archivo es corto y lo que no tenga que
 * enseñarse va en `config/env.server.ts`.
 *
 * Las dos que quedan son direcciones públicas de todos modos: el dominio de la
 * aplicación aparece en cada enlace de «Entrar», y el de este sitio es el que
 * se está mirando.
 */
const esquema = z.object({
  // Dirección de la APLICACIÓN (repo BARION-FRONT), que es OTRO despliegue en
  // otro dominio. Entrar y registrarse son suyos: este sitio solo enlaza. Sin
  // ella los CTA no tienen a dónde ir, así que no lleva valor de reserva.
  NEXT_PUBLIC_APP_URL: z.url(),
  // Dirección pública de ESTE sitio. De ella salen la canónica, el `@id` del
  // JSON-LD, el sitemap y la imagen social. Opcional a propósito: en desarrollo
  // no hay dominio que poner, y sin ella se omiten esas cuatro cosas en vez de
  // publicarlas apuntando a `localhost`. En producción es imprescindible.
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
})

// Referencias literales a `process.env.NEXT_PUBLIC_*`: Next solo sustituye lo
// que ve escrito, no `process.env[variable]`.
const variables = esquema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})

export const envPublico = {
  appUrl: variables.NEXT_PUBLIC_APP_URL,
  siteUrl: variables.NEXT_PUBLIC_SITE_URL,
} as const
