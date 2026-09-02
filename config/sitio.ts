/**
 * Identidad del sitio que NO depende del idioma.
 *
 * El nombre, el titular, la descripción y el resumen para modelos vivían aquí y
 * **se mudaron a `constants/textos/`**: son texto, y el texto tiene idioma.
 * Dejarlos aquí habría obligado a que la versión inglesa se describiera en
 * español justo en los cinco canales que la definen —`<title>`, meta
 * descripción, tarjeta social, JSON-LD y `/llms.txt`—, que es el sitio donde
 * menos se nota y más cuesta.
 *
 * Lo que queda es lo que se dice igual en cualquier idioma: cómo se llama la
 * marca y qué imágenes la representan.
 */

export const NOMBRE_SITIO = "Barion"

/**
 * La tarjeta que se ve al compartir un enlace. **Una imagen propia, no la
 * fotografía del hero.**
 *
 * ── Por qué no vale reutilizar el webp de la sala ───────────────────────────
 *  · **El formato.** WhatsApp, LinkedIn y varios clientes de correo no pintan
 *    WebP en la vista previa de un enlace: la tarjeta se cae al texto sin
 *    imagen, que es peor que una imagen fea — el enlace deja de llamar la
 *    atención. JPEG es el formato que entienden todos, y en una fotografía pesa
 *    la décima parte que un PNG del mismo encuadre.
 *  · **La proporción.** Open Graph y Twitter esperan 1,91:1 (1200×630). La sala
 *    es 3:2, así que se recortaba por arriba y por abajo, y el recorte no lo
 *    elegía nadie.
 *
 * `og.jpg` es esa misma sala compuesta A PROPÓSITO para ese encuadre: recorte
 * 1200×630, el velo lateral del hero y el logotipo encima. El webp se queda
 * para lo que es — la fotografía DENTRO de la página, servida por el
 * optimizador de Next en la variante de cada pantalla.
 *
 * El texto alternativo NO está aquí: se lee y por tanto se traduce
 * (`identidad.altImagenSocial`).
 */
export const IMAGEN_SOCIAL = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
} as const

/** Logotipo en absoluto para el JSON-LD (la variante clara, sobre fondo claro). */
export const LOGO_SOCIAL = "/barion-logo-light.webp"

// Aquí vivía `PAISES_SERVIDOS`, derivado de `regiones`. Se retiró porque decía
// una cosa y significaba otra: eran los países que este repositorio sabe
// FORMATEAR, publicados en el JSON-LD y en `/llms.txt` como los países donde
// Barion opera. Dónde se opera lo decide `paises.activo` en la base y lo sirve
// `GET /publico/paises` — la misma respuesta que consumen el selector de
// precios y el formulario de alta.
