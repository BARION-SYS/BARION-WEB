# barion — web

Sitio público de Barion: la página que explica el producto, muestra los precios por país y manda a crear una barbería. Despliegue **independiente** de la aplicación (repo `BARION-FRONT`), con su propio dominio.

Arquitectura y convenciones: `CLAUDE.md`.

## Requisitos

- Node 22 · pnpm 10.33.3 (lo fija `packageManager`)

## Poner en marcha

```bash
cp .env.example .env    # y ajustar los dominios
pnpm install            # SIEMPRE desde el host, nunca dentro del contenedor
pnpm dev                # http://localhost:2004
```

Dentro del sistema completo se levanta con el compose del repo padre:

```bash
docker compose -f docker-compose.dev.yml up -d --build landing
```

El contenedor monta este repo entero (incluido `node_modules`) y corre con el uid del host: instalar dependencias es siempre `pnpm add` **en el host**, sin rebuild ni reinicio.

## Variables de entorno

| Variable               | Obligatoria | Para qué                                                                   |
| ---------------------- | ----------- | -------------------------------------------------------------------------- |
| `PORT`                 | sí          | Puerto de Next. Sin ella se va a 3000 y el contenedor queda mudo           |
| `API_URL`              | sí          | API con prefijo `/api/v1`, vista **desde el servidor**. No va al navegador |
| `NEXT_PUBLIC_APP_URL`  | sí          | Dominio de la aplicación: destino de «Entrar» y «Empezar la prueba»        |
| `NEXT_PUBLIC_SITE_URL` | en prod     | Dominio propio — imagen social, canónica, JSON-LD, sitemap y robots        |
| `ALLOWED_DEV_ORIGINS`  | no          | Orígenes del proxy en dev (HMR). Solo servidor                             |

Las `NEXT_PUBLIC_*` se hornean en el build: en producción entran como `ARG` del `Dockerfile`, no por `env_file`. Quedan escritas en el JavaScript que descarga el navegador — por eso `API_URL` **no** lleva ese prefijo: el navegador no habla con la api, habla con este sitio (`/api/…`) y el servidor va a buscar el dato.

`API_URL` hace falta en el **build** (`/llms.txt` se prerrenderiza con los precios dentro) y otra vez en **ejecución** (de ahí sale cada revalidación). Y la resuelve el proceso de Next, no el navegador: desde el host `localhost` es la api del host, pero dentro del contenedor hay que apuntar a `http://api:2001/api/v1`.

`NEXT_PUBLIC_SITE_URL` no es obligatoria para arrancar, pero sin ella no se publican ni el JSON-LD, ni la canónica, ni el sitemap: en dev es lo correcto (nada apuntando a `localhost`), en producción es un despliegue invisible para los buscadores.

## Rutas generadas

Además de la portada, Next genera cuatro direcciones que no pinta React. No hay archivos estáticos equivalentes en `public/` — el contenido sale de las constantes y de la API, así que uno escrito a mano mentiría en la primera subida de precios.

| Ruta           | Origen                    | Qué es                                                                       |
| -------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `/robots.txt`  | `app/robots.ts`           | Todo abierto, rastreadores de IA incluidos, con la referencia al sitemap     |
| `/sitemap.xml` | `app/sitemap.ts`          | Una sola dirección: las secciones son anclas, no URLs                        |
| `/llms.txt`    | `app/llms.txt/route.ts`   | El sitio en texto plano para modelos: qué es, qué no es, precios y preguntas |
| `/api/planes`  | `app/api/planes/route.ts` | Intermediario sobre `services/planes` — la única API que ve el navegador     |

## Scripts

| Comando       | Qué hace                  |
| ------------- | ------------------------- |
| `pnpm dev`    | desarrollo con hot reload |
| `pnpm build`  | build de producción       |
| `pnpm start`  | sirve el build            |
| `pnpm lint`   | eslint + `tsc --noEmit`   |
| `pnpm format` | prettier                  |

## Añadir un primitivo de UI

```bash
pnpm dlx shadcn@latest add <componente>
```

Se escribe en `components/ui/`. Los tokens de color viven en `app/globals.css` y son la única fuente de la paleta.
