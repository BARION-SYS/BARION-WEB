# barion (web — sitio público) — PRODUCCIÓN (multi-stage, Next.js standalone)
# Requiere `output: 'standalone'` en next.config.ts — activarlo al desplegar de verdad.

# ---------- Stage 1: dependencias ----------
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Stage 2: build ----------
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Variables NEXT_PUBLIC_* se hornean en el build: quedan escritas en el
# JavaScript que descarga el navegador. Cambiarlas obliga a reconstruir.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# API_URL NO lleva prefijo público: no entra en el bundle. Hace falta aquí
# porque `/llms.txt` se prerrenderiza con los precios dentro, y OTRA VEZ en
# ejecución —el `runner` la recibe por env_file— porque de ahí sale cada
# revalidación. Un valor de build que no exista en ejecución arranca el
# contenedor y revienta en la primera revalidación.
ARG API_URL
ENV API_URL=$API_URL

# Verificación de propiedad del dominio (Search Console y Bing Webmaster Tools).
#
# Van aquí, en el BUILD, aunque no lleven prefijo público y no entren en el
# bundle: las páginas se prerrenderizan, así que la etiqueta se escribe en el
# HTML al construir. Pasarlas solo por `env_file` las deja fuera de las páginas
# ya generadas y la verificación no aparece nunca — con la agravante de que el
# contenedor arranca sano y el fallo solo se ve mirando el HTML servido.
#
# Sin valor no se pinta la etiqueta, que es lo que se quiere: una vacía no
# verifica nada y hace fallar la comprobación con un mensaje que no dice por qué.
ARG GOOGLE_SITE_VERIFICATION
ARG BING_SITE_VERIFICATION
ENV GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION
ENV BING_SITE_VERIFICATION=$BING_SITE_VERIFICATION

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------- Stage 3: runner ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S barion && adduser -S barion -G barion

COPY --from=build --chown=barion:barion /app/.next/standalone ./
COPY --from=build --chown=barion:barion /app/.next/static ./.next/static
COPY --from=build --chown=barion:barion /app/public ./public

USER barion
EXPOSE 31004
ENV PORT=31004 HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
