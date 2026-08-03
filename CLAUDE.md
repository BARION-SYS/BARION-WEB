# CLAUDE.md — barion (web)

Sitio **público** de Barion: la página que explica el producto, enseña los precios en la moneda del país de quien mira y manda a crear una barbería. Next.js App Router. **Es un despliegue aparte, con su propio dominio**, separado de la aplicación (repo `BARION-FRONT`).

**Quién lee este sitio:** el **dueño de una barbería** evaluando contratar. Ni el barbero (no compra), ni el cliente final (nunca llega aquí — entra por el escaparate `/b/{slug}` de la aplicación).

## Por qué es un repo aparte

La landing y el panel no se parecen en nada más que en la marca:

- **Vive de posicionar en buscadores.** Renderiza en el servidor, sin sesión, y se cachea. El panel es lo contrario: todo detrás de login, nada indexable.
- **Cambia por razones distintas.** Un texto de venta o un precio nuevo no deberían obligar a redesplegar la aplicación, ni al revés.
- **Pesa distinto.** Aquí no entran axios, zustand, react-hook-form, recharts ni el cliente HTTP con sesión. Una landing que arrastra el bundle del panel tarda más en pintar, y lo que tarda no vende.

**Nada se comparte por código entre este repo y `BARION-FRONT`.** Componentes duplicados entre los dos (el logo, el botón, el selector) son duplicación **querida**: cada repo evoluciona el suyo. Lo único que los une es la marca visual y una convención de URLs.

## Qué NO se construye aquí, y no es un olvido

| No va                                            | Por qué                                                                     |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| Login, registro, recuperar contraseña            | Son de la aplicación (`BARION-FRONT`). Aquí solo se enlaza a su dominio     |
| Cualquier pantalla con sesión                    | Este sitio no tiene sesión, ni cookie, ni cliente HTTP autenticado          |
| Buscador o directorio de barberías               | Convertiría a Barion en un marketplace que compite con sus propios clientes |
| Testimonios, logos de clientes, «+500 barberías» | No hay clientes todavía. Inventar prueba social está fuera de discusión     |
| Colores de marca del tenant                      | La landing no pertenece a ninguna barbería: siempre los tokens por defecto  |

## Stack

| Herramienta             | Rol                                                |
| ----------------------- | -------------------------------------------------- |
| Next.js 16 (App Router) | Framework + routing                                |
| React 19                | UI runtime                                         |
| TypeScript              | Tipado estricto — `any` prohibido (usar `unknown`) |
| Tailwind CSS 4          | Estilos (tokens en `app/globals.css`)              |
| shadcn/ui + Base UI     | Primitivos (`components/ui/`)                      |
| next-themes             | Tema claro/oscuro                                  |
| motion                  | Animaciones (importar de `motion/react`)           |
| zod                     | Validación de las variables de entorno             |

## Estructura

```text
/
├── app/            # layout raíz (cabecera + pie + tema), page.tsx (la landing), not-found, globals.css
│   ├── favicon.ico #   └─ icono del navegador (16/32/48) — convención de archivo
│   ├── apple-icon.png  # └─ icono de iOS (180) — convención de archivo
│   ├── robots.ts   #   └─ /robots.txt      — generados por Next, no hay archivos
│   ├── sitemap.ts  #   └─ /sitemap.xml        estáticos en public/ para esto
│   ├── llms.txt/   #   └─ /llms.txt        — el sitio en texto plano, para modelos
│   └── api/        #   └─ la ÚNICA API que ve el navegador: mismo origen, sobre services/
├── components/
│   ├── sections/   # las secciones de la página: Hero, ValorList, VistaPrevia, PreciosList, PreguntasFrecuentes, Cierre…
│   ├── layout/     # Nav, Footer, ThemeToggle — envuelven TODA la superficie
│   ├── brand/      # LogoBarion
│   ├── common/     # reutilizable entre secciones (RevelarEnScroll, InitialsAvatar, DatosEstructurados)
│   ├── providers/  # ThemeProvider, MotionProvider
│   └── ui/         # primitivos shadcn — los escribe la CLI, no editar a mano salvo tokens
├── config/         # env.public.ts + env.server.ts, regiones.ts (CO/COP, US/USD, ES/EUR), rutas.ts (destinos), sitio.ts (identidad)
├── constants/      # contenido de la página (valor.ts, faq.ts) + respaldo de planes
├── services/       # el dato: pide, valida y decide el respaldo. Server-only
├── hooks/          # useMontado (guard de hidratación), useRegion (cambio de país)
├── lib/            # utils.ts (cn), currency.ts, region.ts, seo.ts (JSON-LD)
│   └── api/        #   └─ cliente.ts (el único fetch a la api) + endpoints.ts
├── types/          # landing.ts — lo que devuelve la API pública
└── public/         # SOLO los webp de marca: logotipo y marca, en claro y oscuro, + la sala del hero
```

**Estos son los únicos directorios raíz.** Ningún `.tsx` suelto fuera de ellos.

**Nada que dependa del tema se pinta con `useState` + `useEffect`.** El tema real vive en el navegador, así que el primer render tiene que ser el mismo que el del servidor; el guard es `useMontado()` (`hooks/useMontado.ts`, sobre `useSyncExternalStore`). El patrón clásico del mounted flag es un `setState` dentro de un efecto y el lint lo rechaza — con razón: son dos renders donde basta uno.

## Reglas del sitio

- **`app/page.tsx` es Server Component, a propósito.** Es la única página del sistema que tiene que posicionar en un buscador: los precios llegan renderizados y el país se deduce de las cabeceras de la petición, que solo existen en el servidor. Lo interactivo (selector de país, menú móvil, animaciones) son componentes cliente colgando de ella. **No ponerle `'use client'`** — rompería las tres cosas.
- **Cabecera y pie viven en el layout raíz**, no en un grupo de rutas: el 404 los hereda y una dirección equivocada deja al visitante dentro del sitio.
- **`config/rutas.ts` es la fuente única de los destinos.** Las anclas son ids reales del DOM; `rutasApp` son URLs absolutas al dominio de la aplicación, construidas desde `NEXT_PUBLIC_APP_URL`. **Enlace a la aplicación = `<a href>`, nunca `next/link`**: no hay ruta de este sitio que prefetchear.
- **`config/env.public.ts` y `config/env.server.ts` son los únicos archivos que tocan `process.env`** (validados con zod). Falta una variable = revienta al arrancar, que es cuando se puede arreglar.
- **Dinero**: siempre unidad menor (centavos) + ISO 4217; el formateo, solo en `lib/currency.ts`. **La escala y los decimales visibles son cosas DISTINTAS**: el peso colombiano se guarda en centavos (escala 2, tabla `escalaPorMoneda`) y se enseña sin decimales (lo decide CLDR). Usar los decimales de pantalla para dividir es un error de factor cien — es exactamente el que enseñaba «$ 8.900.000» donde iban $ 89.000. Todo importe de maqueta (`HeroPanel`, `EscaparateDemo`) también va en unidad menor.
- **La región es COSMÉTICA**: decide qué precios se enseñan (cookie elegida a mano > `Accept-Language` > Colombia). El país que se factura es `barberias.codigo_pais` y se fija al crear la barbería.

## Datos: quién habla con la API

Cuatro capas, y cada una hace UNA cosa. Un `fetch` suelto dentro de un componente se las salta todas.

```text
componente / route handler   ← solo pinta o responde
        ↓
services/                    ← QUÉ dato: caché, validación, respaldo
        ↓
lib/api/cliente.ts           ← CÓMO se pide: dominio, timeout, ErrorApi
        ↓
config/env.server.ts         ← DÓNDE está la api (server-only)
```

- **`NEXT_PUBLIC_` no es una etiqueta, es una orden de incrustar en el bundle.** `API_URL` va SIN prefijo: la dirección de la api no tiene por qué viajar al navegador. Si vuelve a hacer falta desde el cliente, se añade una ruta en `app/api/`, nunca una variable pública.
- **`config/env.server.ts` y todo `services/` llevan `import "server-only"`.** No es documentación: si un componente cliente los importa —aunque sea a través de tres intermediarios— **el build falla** con el archivo culpable. Un comentario que pide no importar algo no aguanta seis meses.
- **El navegador habla SOLO con este sitio.** `app/api/planes/route.ts` es un intermediario delgado sobre `services/`: mismo origen (sin CORS), caché propia y la api real invisible. Devuelve la MISMA envoltura `{ data }` del contrato.
- **`lib/api/cliente.ts` es el único `fetch` a la api.** Pone el dominio, acota la espera (4 s: pasado eso al servicio le sale mejor su respaldo) y convierte el fallo en `ErrorApi` con estado — un `TypeError` genérico no deja decidir nada.
- **Un servicio VALIDA lo que llega.** Nada de `as Tipo[]`: eso no comprueba nada y revienta después, dentro del componente y en producción. El esquema zod va atado al tipo de `types/` con `satisfies`, así que un contrato que cambie en un sitio y no en el otro no compila. El respaldo se valida al arrancar, no al usarse.
- **Un servicio decide el respaldo, y lo AVISA.** `services/planes.ts` lee `GET /publico/planes` de verdad; `constants/planes.fallback.json` es lo que sirve cuando esa lectura NO se puede usar —nadie contesta, contesta un error, contesta algo fuera de contrato o contesta `data: []`—, y cada caso sale con su causa exacta en un `console.warn` del servidor. Sin ese aviso, una api caída se ve igual que una api sana y nadie se entera de que la página lleva un mes con precios congelados; por eso el camino bueno también deja su línea (`console.info`, cuántos planes) — «ningún aviso» se confunde con «la ruta salió de caché». **En pantalla no se avisa de nada**: quien mira precios no tiene por qué leer que el proveedor tiene un problema.
- **Un valor que este sitio no conoce descarta ESE precio, nunca la lista.** El contrato declara `codigoPais`, `moneda` y `periodo` como cadenas libres, y `precios_plan.codigo_pais` es un `char(2)` sin lista cerrada: validarlos con un `z.enum` haría que dar de alta México tumbara la tabla de precios ENTERA al respaldo por un precio que la página ni siquiera enseña. Lo que valida zod en la frontera es la FORMA (campos presentes, importe en dígitos); qué valores se saben pintar se decide precio a precio. Un plan que se queda sin ninguno se enseña con «Consultar»: inventar una conversión está prohibido.
- **Los hooks son del cliente y no piden datos.** `useRegion` guarda la elección y pide al servidor que repinte; los precios los resuelve el servidor. Recalcularlos en el cliente sería una segunda verdad, y la buena es la que ve el buscador.

## Posicionamiento y contexto para máquinas

Este sitio no compite por diseño, compite por ser encontrado. Lo que hay que preservar cuando se toca:

- **`config/sitio.ts` es la identidad del sitio**: nombre, título, descripción, resumen para IA, palabras clave e imagen social. Los cinco canales que describen Barion —`<title>`, meta descripción, tarjeta social, JSON-LD y `/llms.txt`— leen de ahí. **Nunca escribir el título o la descripción dentro de un componente**: a la tercera edición dejan de coincidir y un sitio que se describe distinto en cada canal no se posiciona.
- **`constants/faq.ts` es UNA fuente y TRES destinos**: la sección visible, el `FAQPage` del JSON-LD y `/llms.txt`. Por eso las respuestas son **texto plano, sin JSX ni marcado** — un enlace dentro de una respuesta obligaría a mantener dos versiones.
- **El acordeón de preguntas es `<details>`/`<summary>` nativo, no un componente cliente.** La respuesta tiene que estar en el HTML de origen esté abierta o cerrada: un acordeón que monta el contenido al abrirlo publica una página con quince preguntas y ninguna respuesta. La animación es CSS (`.acordeon-suave` + `interpolate-size`), cero JavaScript.
- **`lib/seo.ts` es el único sitio donde se construye JSON-LD**, y siempre desde los mismos datos que pinta la página. Un dato estructurado que contradice al texto visible se penaliza. **Prohibido `aggregateRating`, `review` o cualquier cifra de clientes**: no hay clientes todavía, y una valoración inventada retira el resultado enriquecido para siempre.
- **La canónica vive en `app/page.tsx`, no en el layout**: en el layout la heredaría el 404 y le pediría al buscador que indexe la portada una vez por cada enlace roto.
- **`/robots.txt`, `/sitemap.xml` y `/llms.txt` los genera Next** (`app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts`), nunca archivos estáticos en `public/`: los precios y el texto salen de las constantes y de la API, así que un archivo escrito a mano miente en la primera subida de precios.
- **Las anclas NO son URLs que indexar.** El sitemap lleva una sola dirección porque el sitio es una sola página; declarar `#precios` aparte crea contenido duplicado consigo mismo. Página nueva = entrada en `config/rutas.ts` y en el sitemap.
- **`NEXT_PUBLIC_SITE_URL` es opcional pero decide qué se publica**: sin ella no hay `@id` estable, así que se omiten el JSON-LD, el sitemap y la referencia al mapa en el `robots.txt` en vez de publicarlos apuntando a `localhost`. **En producción es obligatoria de hecho** — sin ella el sitio se sirve entero pero invisible para lo estructurado.
- **Los rastreadores de IA no se bloquean.** Barion vende software, no publica contenido revendible: que un asistente sepa responder «qué es Barion» es distribución gratis. Para eso está `/llms.txt`.
- **El optimizador de imágenes se queda encendido.** La fotografía del hero decide el LCP, que es la métrica con la que Google ordena; con `images.unoptimized` un móvil se descarga la variante de escritorio entera. `sharp` viene con Next y entra en la imagen de producción sola. Y `output: "standalone"` es lo que produce `.next/standalone`, que es lo que copia el `Dockerfile` — quitarlo deja la imagen de producción sin construir.
- **`alternates` no se hereda del layout**: Next lo sustituye entero, no lo fusiona. Canónica y `text/plain` van juntos en `app/page.tsx`. Lo mismo pasaría con cualquier otro objeto de metadata declarado en los dos sitios.

## UI y tema (`app/globals.css`)

**Fuente única de la paleta.** `:root` = claro · `.dark` = oscuro. Un color nuevo va a AMBOS bloques.

- En componentes SOLO tokens semánticos: `bg-card`, `text-muted-foreground`, `text-(--exito)`.
- **PROHIBIDO**: color hardcodeado (`#fff`, `text-gray-700`) y el variant **`dark:`** — cada token ya define claro y oscuro.
- **Color dinámico (que llega por dato/prop): SIEMPRE como variable CSS + clase** — `style={{ "--tono": color }}` + `className="text-(--tono)"`. Nunca `style={{ color }}` directo.
- **Logo = SIEMPRE `LogoBarion`**: resuelve el asset webp según el tema. Nunca un `<Image>` directo a esos archivos.
- **Iconos del navegador: `app/favicon.ico` y `app/apple-icon.png`, por convención de archivo.** Ni campo `icons` en la metadata (duplicaría los `<link>`) ni favicon en webp: Safari no lo pinta y Google no lo acepta para el icono del resultado. Los webp de `public/` son el logotipo DENTRO de la página, que es otra cosa. Un asset en `public/` que no referencie ningún componente sobra — se borra.
- **Animaciones con `motion`**: todo el árbol va bajo el `MotionConfig reducedMotion="user"` del layout — no anidar otro. Entradas con springs suaves (stiffness ~140, damping ~22), micro-interacciones 150-300ms.

## Comandos

Todo se ejecuta **desde el HOST**, nunca dentro del contenedor:

```bash
pnpm install     # dependencias
pnpm dev         # desarrollo (el compose del padre levanta esto mismo)
pnpm lint        # eslint + tsc --noEmit
pnpm format      # prettier
```

Idioma del código: inglés para el vocabulario técnico, español para el dominio y para todo texto visible.
