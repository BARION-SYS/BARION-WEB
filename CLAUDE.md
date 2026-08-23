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
├── proxy.ts        # negocia el idioma y redirige toda ruta sin prefijo (Next 16: antes «middleware»)
├── app/
│   ├── [idioma]/   # TODA página vive aquí. Su layout ES el layout raíz: el <html lang> sale del segmento
│   │   ├── page.tsx        #   portada (resumen + enlaces a cada sección)
│   │   ├── producto/       #   una PÁGINA por sección del navbar, no un ancla
│   │   ├── vista-previa/
│   │   ├── precios/
│   │   ├── preguntas/
│   │   ├── legal/          #   términos, privacidad y cookies
│   │   └── not-found.tsx
│   ├── favicon.ico #   icono del navegador (16/32/48) — convención de archivo
│   ├── apple-icon.png  # icono de iOS (180) — convención de archivo
│   ├── globals.css
│   ├── robots.ts   #   /robots.txt      — generados por Next, no hay archivos
│   ├── sitemap.ts  #   /sitemap.xml       estáticos en public/ para esto
│   ├── llms.txt/   #   /llms.txt        — el sitio en texto plano, para modelos
│   └── api/        #   la ÚNICA API que ve el navegador: mismo origen, sobre services/
├── components/
│   ├── sections/   # Hero, EncabezadoSeccion, ValorList, VistaPrevia, PreciosList, PreguntasFrecuentes, Cierre…
│   ├── layout/     # Nav, Footer, ThemeToggle, SelectorIdioma — envuelven TODA la superficie
│   ├── brand/      # LogoBarion
│   ├── legal/      # DocumentoLegal — UN renderizador para los tres documentos
│   ├── common/     # reutilizable entre secciones (RevelarEnScroll, InitialsAvatar, DatosEstructurados)
│   ├── providers/  # ThemeProvider, MotionProvider
│   └── ui/         # primitivos shadcn — los escribe la CLI, no editar a mano salvo tokens
├── config/         # env.*.ts, idiomas.ts, contenido.ts (claves e iconos), regiones.ts, rutas.ts, sitio.ts, legal.ts, periodos.ts
├── constants/
│   ├── textos/     # los diccionarios: tipos.ts (el contrato) + es.ts (base) + en.ts
│   ├── legal/      # los tres documentos, como datos
│   └── planes.fallback.json
├── services/       # el dato: pide, valida y decide el respaldo. Server-only
├── hooks/          # useMontado (guard de hidratación), useRegion (país), useIdioma (idioma)
├── lib/            # utils.ts (cn), currency.ts, region.ts, textos.ts, legal.ts, seo.ts (JSON-LD + hreflang)
│   └── api/        #   └─ cliente.ts (el único fetch a la api) + endpoints.ts
├── types/          # landing.ts — lo que devuelve la API pública
└── public/         # SOLO los webp de marca: logotipo y marca, en claro y oscuro, + la sala del hero
```

**Estos son los únicos directorios raíz.** Ningún `.tsx` suelto fuera de ellos.

**Nada que dependa del tema se pinta con `useState` + `useEffect`.** El tema real vive en el navegador, así que el primer render tiene que ser el mismo que el del servidor; el guard es `useMontado()` (`hooks/useMontado.ts`, sobre `useSyncExternalStore`). El patrón clásico del mounted flag es un `setState` dentro de un efecto y el lint lo rechaza — con razón: son dos renders donde basta uno.

## Reglas del sitio

- **Cada sección del navbar es una PÁGINA, no un ancla.** Producto, cómo se ve, precios y preguntas viven en `/[idioma]/…`; el navbar enlaza con `next/link` y marca la activa con `usePathname()`. Antes eran anclas de la portada y el activo salía de un `IntersectionObserver` sobre sus elementos: **desde cualquier página que no fuera la portada —las legales, por ejemplo— el observador no encontraba nada y los enlaces no llevaban a ninguna parte.** La cabecera se veía entera y no funcionaba.
  - **La portada es un RESUMEN.** Cada bloque enseña lo justo para decidir si seguir leyendo y enlaza a su página, que es la que tiene el detalle. Repetir el contenido entero en las dos pondría el mismo texto en dos direcciones, y dos direcciones con el mismo texto compiten por la misma consulta.
  - **Cada página profunda tiene salida propia, y no basta con la cabecera.** Se llega a un documento legal desde el pie, y allí ninguna de las cuatro secciones se marca como activa —ninguna es «legal»—, así que la página se lee como un callejón aunque la cabecera esté delante. Lo resuelven tres piezas: `Migas` (dónde estás y vuelta al nivel de arriba), `NavegacionLegal` (cruzar entre los tres documentos sin recorrer uno entero hasta el pie) y los enlaces legales en el menú móvil.
  - **Un nivel de miga sin página no se enlaza.** «Legal» agrupa tres documentos y no es ninguno: enlazarlo al primero sería un enlace que lleva a algo distinto de lo que nombra. `aria-current="page"` va solo en la última.
  - **La cabecera lleva «Inicio» y las cuatro secciones**, marca la activa y es fija: es la ÚNICA navegación del sitio. Volver a la portada es un ítem más de esa pastilla — que es lo que había que hacer desde el principio.
  - **NO se añade una segunda navegación entre secciones**, y se intentó dos veces: primero como «anterior / siguiente» al pie y después como índice. Las dos sobraban por lo mismo: la cabecera ya está siempre a la vista. Una navegación repetida al final no añade un destino, añade ruido justo donde tiene que estar el botón que convierte.
  - La cabecera es una **rejilla `1fr auto 1fr`**, no una fila flexible. Las dos columnas laterales se reparten el sobrante a partes iguales, así que la pastilla cae en el centro de la PANTALLA. Con `mx-auto` en una fila se centraba respecto al hueco libre —y con el logotipo a un lado y tres botones al otro, eso no es el centro—; posicionada en absoluto se centraba bien pero no reservaba espacio y a 1024 px se solapaba con los botones.
  - **El velo del menú móvil va como hermano de la cabecera, no dentro.** La cabecera crea contexto de apilamiento: un hijo suyo con z negativo se pinta encima de su propio fondo, así que el velo acabaría tiñendo la barra. Fuera, con `z-40` contra el `z-50` de la cabecera, cubre la página y no la barra.
  - **La portada vende SOLA.** Es la regla que ordena qué se recorta: los tres bloques van con su detalle y los precios con su selector de país, porque es lo concreto lo que convence y esconderlo tras un clic mete un paso entre alguien interesado y la compra. A las páginas de sección se les deja el segundo orden — las capacidades extra, el escaparate jugable, las preguntas completas—, que es lo que justifica visitarlas.
  - El `FAQPage` del JSON-LD se declara **solo en `/preguntas`**: afirma «esta dirección responde estas preguntas», así que en una portada que enseña cinco de dieciocho promete lo que no da.
- **`app/[idioma]/page.tsx` es Server Component, a propósito.** Es la única página del sistema que tiene que posicionar en un buscador: los precios llegan renderizados y el país se deduce de las cabeceras de la petición, que solo existen en el servidor. Lo interactivo (selector de país, menú móvil, animaciones) son componentes cliente colgando de ella. **No ponerle `'use client'`** — rompería las tres cosas.
- **Cabecera y pie viven en el layout raíz**, no en un grupo de rutas: el 404 los hereda y una dirección equivocada deja al visitante dentro del sitio.
- **`config/rutas.ts` es la fuente única de los destinos.** Las anclas son ids reales del DOM; `rutasApp` son URLs absolutas al dominio de la aplicación, construidas desde `NEXT_PUBLIC_APP_URL`. **Enlace a la aplicación = `<a href>`, nunca `next/link`**: no hay ruta de este sitio que prefetchear.
- **`config/env.public.ts` y `config/env.server.ts` son los únicos archivos que tocan `process.env`** (validados con zod). Falta una variable = revienta al arrancar, que es cuando se puede arreglar.
- **Dinero**: siempre unidad menor (centavos) + ISO 4217; el formateo, solo en `lib/currency.ts`. **La escala y los decimales visibles son cosas DISTINTAS, y cada una tiene su tabla**: el peso colombiano se guarda en centavos (`escalaPorMoneda`: 2) y se enseña sin decimales (`decimalesPorMoneda`: 0). Usar los decimales de pantalla para dividir es un error de factor cien — es exactamente el que enseñaba «$ 8.900.000» donde iban $ 89.000. **Los decimales visibles NO se le dejan a CLDR**: `Intl` trae una versión de ICU en el servidor y otra en el navegador, y el mismo importe salía `$ 1.280.000` arriba y `$ 1.280.000,00` abajo — hidratación rota y árbol repintado entero en el cliente. Todo importe de maqueta (`HeroPanel`, `EscaparateDemo`) también va en unidad menor.
- **Lo legal se publica AQUÍ, y es el único contenido del sitio que otro repo consume.** Términos (con el anexo de encargo dentro), privacidad y cookies viven en `app/[idioma]/legal/` —bajo el segmento de idioma, como todo lo demás del sitio—, se escriben como datos en `constants/legal/` —igual que el FAQ, y por lo mismo: más de un destino— y los pinta un solo `components/legal/DocumentoLegal.tsx`. Se indexan a propósito: quien los busca todavía no tiene cuenta con la que entrar a leerlos.
  - **`VERSION_LEGAL` (`config/legal.ts`) está escrita en DOS sitios del sistema**, aquí y en `BARION-API/src/common/legal/version.ts`, porque es lo que la api guarda como «qué aceptó esta barbería» al darse de alta. **Tocar el texto de cualquiera de los tres documentos obliga a subirla en los dos.** El navegador no la manda: la escribe la api desde su constante, para que nadie pueda declarar que aceptó otra cosa.
  - **Lo que `IDENTIDAD_LEGAL` no sabe, no se publica.** Razón social, identificación fiscal, domicilio y jurisdicción no están en ningún archivo de este sistema: mientras estén en `null`, la ficha del titular sale con lo que hay y la sección de ley aplicable **no existe**. Inventarlas sería peor que omitirlas.
  - **`SUBENCARGADOS` es UNA lista y DOS destinos**: la tabla de destinatarios de la privacidad y la de subencargados del anexo de los términos. Dos listas se desincronizan al primer proveedor nuevo, y una lista de subencargados incompleta es exactamente el incumplimiento que el anexo dice no cometer.
- **Idioma y región son cosas DISTINTAS, y por eso viajan distinto.** El idioma decide el texto y va **en la URL** (`/es/precios`, `/en/precios`), porque cada versión tiene que poder indexarse por separado — un sitio que cambia de idioma sin cambiar de dirección publica una página para dos consultas. La región decide la MONEDA y va en una cookie, porque es cosmética. Un colombiano puede querer leer en inglés y seguir pagando en pesos.
  - **Todos los idiomas llevan prefijo, también el español.** Sin él, `/precios` significaría dos cosas —la página, y «la versión española de la página»—; con prefijo, `/` no es una página sino una decisión que resuelve `proxy.ts`.
  - **Los segmentos NO se traducen** (`/en/precios`, no `/en/pricing`). Con rutas traducidas, cada página necesitaría saber cómo se llama en los otros idiomas para ofrecer el cambio y declarar su `hreflang`: una tabla de equivalencias más, y la primera ruta que se añada sin actualizarla deja el selector de idioma llevando al 404.
  - **`proxy.ts` redirige CUALQUIER ruta sin idioma**, no solo `/`. La aplicación enlaza a `/legal/terminos` desde la casilla del alta, y ese enlace está compilado dentro de otro despliegue: reestructurar este sitio no puede romperlo.
  - Canónica y `hreflang` se declaran **por página** con `alternativas()` de `lib/seo.ts`, nunca en el layout: Next sustituye `alternates` entero en vez de fusionarlo.
- **El texto sale del diccionario, y el diccionario se resuelve en el SERVIDOR.** `obtenerTextos(idioma)` a partir del segmento; los componentes cliente reciben su porción por props. Sin proveedor, sin store y sin hidratación — que es la diferencia grande con el panel, y viene de que aquí el idioma está en la URL.
  - **`config/contenido.ts` tiene la ESTRUCTURA** (qué bloques hay, en qué orden, con qué icono) y **`messages/{es,en}.json` el TEXTO**. Un icono no se traduce y un orden tampoco; si vivieran en el diccionario habría que repetirlos por idioma, y el día que se reordenen en español el inglés se queda con el orden viejo sin que nada avise.
  - **El inglés se declara con el tipo del español, y esa asignación ES la comprobación**: `i18n/completitud.ts` hace `export const mensajesEn: typeof es = en`, así que **falta una clave y no compila**. Sobrarle alguna sí está permitido —`avisoIdiomaLegal` solo existe en inglés—. Es una línea, y sustituye a lo que en el panel hacen los diccionarios en TypeScript: aquí el texto es JSON porque lo consume `next-intl`, y el chequeo se recupera con esa sola asignación.
  - **Una frase con un dato adentro es una función**, nunca trozos concatenados: el orden de las palabras cambia entre idiomas.
  - **No se traduce lo que llega de la api** (nombres de plan). Sí se traducen las CLAVES de sus funciones, que son banderas de producto y no texto: por eso `services/planes.ts` devuelve claves y el copy lo pone el componente.
  - **Las maquetas también se traducen** (panel del hero, escaparate). Un escaparate en español dentro de la versión inglesa dice, sin querer, que el producto no está en inglés. Los nombres de PERSONA no: traducir un nombre propio es inventárselo.
  - **Los documentos legales están redactados en español y hoy se sirven así en los dos idiomas**, encabezados por `avisoIdiomaLegal`, que dice cuál es la versión que rige. `lib/legal.ts` ya admite un segundo mapa de constructores: traducirlos es añadir esos archivos y una entrada. Traducir un contrato a medias no es una mejora parcial, es un contrato que dice otra cosa.
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
- **El sitemap declara todas las páginas × todos los idiomas, cada una con sus `alternates`.** Sin eso un buscador ve dos sitios que dicen lo mismo y elige uno; con eso entiende que son la misma página en dos idiomas. Página nueva = un segmento en `config/rutas.ts` y una entrada en `PAGINAS` de `app/sitemap.ts` — una página que no esté ahí existe pero no se anuncia.
- **`NEXT_PUBLIC_SITE_URL` es opcional pero decide qué se publica**: sin ella no hay `@id` estable, así que se omiten el JSON-LD, el sitemap y la referencia al mapa en el `robots.txt` en vez de publicarlos apuntando a `localhost`. **En producción es obligatoria de hecho** — sin ella el sitio se sirve entero pero invisible para lo estructurado.
- **Los rastreadores de IA no se bloquean.** Barion vende software, no publica contenido revendible: que un asistente sepa responder «qué es Barion» es distribución gratis. Para eso está `/llms.txt`.
- **El optimizador de imágenes se queda encendido.** La fotografía del hero decide el LCP, que es la métrica con la que Google ordena; con `images.unoptimized` un móvil se descarga la variante de escritorio entera. `sharp` viene con Next y entra en la imagen de producción sola. Y `output: "standalone"` es lo que produce `.next/standalone`, que es lo que copia el `Dockerfile` — quitarlo deja la imagen de producción sin construir.
- **`alternates` no se hereda del layout**: Next lo sustituye entero, no lo fusiona. Canónica y `text/plain` van juntos en `app/page.tsx`. Lo mismo pasaría con cualquier otro objeto de metadata declarado en los dos sitios.

## Ritmo visual (`lib/superficies.ts` + `components/sections/Seccion.tsx`)

**La paleta NO es la de una recomendación genérica de estilo, y no se cambia.** El oro de marca (`--primary`), el juego de tokens `--hero-*` para lo que va sobre la fotografía y las dos escalas completas de tema son la identidad del producto; sustituirlos por un sistema de plantilla es tirar lo único que este sitio no puede copiar de nadie.

Lo que sí se centralizó es el **ritmo**, porque estaba midiendo distinto en cada sección:

- **`Seccion`** envuelve suelo, aire, separador y contenedor. **El ritmo lo decide la PÁGINA**, no cada sección: es quien sabe en qué orden van y cuál es la última.
  - `tono` alterna `base`/`alterno` para que **dos secciones seguidas nunca compartan fondo**.
  - El **separador se queda encendido aunque alternen**: los dos tonos son deliberadamente poco contrastados y en claro la diferencia casi no se ve — la línea hace el corte, el tono acompaña. **Se apaga en la última**, porque el pie ya trae la suya.
  - `aire`: `normal` para contenido, `compacta` para bandas de servicio (anterior/siguiente), que no deben pesar como una sección.
- **`lib/superficies.ts`** tiene las recetas que se repetían mal medidas: `TARJETA`, `TARJETA_AIRE`, `TARJETA_PULSABLE` (con el anillo de foco **dentro**, que es como deja de olvidarse), `TARJETA_VIVA`, `CONTENEDOR` y `PASO`. Antes había cuatro paddings y seis recetas de hover para la misma idea de tarjeta.
- **`CONTENEDOR` es el único sitio donde se declara el ancho y los márgenes laterales** — cabecera, secciones, pie y documentos legales tiran de él. Con el ancho copiado en cinco archivos, el día que uno cambie el sitio se lee torcido sin que se pueda señalar dónde.
- **El numerito de paso es el mismo en la vista previa y en el cierre** porque es la misma idea, una secuencia. Los bloques de valor conservan su ordinal editorial **a propósito**: no son una secuencia, son tres cosas que pasan a la vez.
- **Las dos maquetas (`HeroPanel`, `EscaparateDemo`) quedan fuera de estas recetas**, y no es deriva: son miniaturas a escala —un panel y un móvil dibujados pequeños— y aplicarles el aire de una tarjeta real las rompería.

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
