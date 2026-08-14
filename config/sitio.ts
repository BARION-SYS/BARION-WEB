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
 * La sala del hero, en su versión nocturna: es la única imagen del sitio con
 * proporción social (3:2). Se declara la oscura porque la tarjeta se ve casi
 * siempre dentro de una aplicación de mensajería, donde el fondo del hilo es
 * oscuro más veces que claro.
 *
 * El texto alternativo NO está aquí: se lee y por tanto se traduce
 * (`identidad.altImagenSocial`).
 */
export const IMAGEN_SOCIAL = {
  url: "/assets/barion-hero-dark.webp",
  width: 1535,
  height: 1024,
} as const

/** Logotipo en absoluto para el JSON-LD (la variante clara, sobre fondo claro). */
export const LOGO_SOCIAL = "/barion-logo-light.webp"

// Aquí vivía `PAISES_SERVIDOS`, derivado de `regiones`. Se retiró porque decía
// una cosa y significaba otra: eran los países que este repositorio sabe
// FORMATEAR, publicados en el JSON-LD y en `/llms.txt` como los países donde
// Barion opera. Dónde se opera lo decide `paises.activo` en la base y lo sirve
// `GET /publico/paises` — la misma respuesta que consumen el selector de
// precios y el formulario de alta.
