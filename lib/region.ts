import {
  REGIONES_CONOCIDAS,
  REGION_DEFAULT,
  esRegionConocida,
  regiones,
  type CodigoRegion,
} from "@/config/regiones"
import type { PaisOperado } from "@/services/paises"

/** Nombre de la cookie que recuerda el país elegido a mano. */
export const COOKIE_REGION = "barion_region"

/**
 * Qué precios se le enseñan a quien está mirando la página.
 *
 * `Accept-Language` y no geolocalización por IP: un servicio de IP es una
 * dependencia de terceros con coste y latencia, y Barion opera con cero costes
 * de terceros. La cabecera acierta casi siempre, no cuesta nada y no manda
 * ningún dato a ninguna parte; cuando falla, el selector lo corrige — y esa
 * corrección manda, por eso la cookie se mira primero.
 *
 * Esto es COSMÉTICO. El país que se factura es `barberias.codigo_pais` y se fija
 * al crear la barbería: mirar la página desde un aeropuerto no cambia el cobro.
 *
 * **No tiene nada que ver con el idioma**, aunque las dos cosas se deduzcan de
 * la misma cabecera: el idioma decide el texto y vive en la URL para poder
 * indexarse; la moneda decide una cifra y vive en una cookie. Un colombiano
 * puede querer leer en inglés y seguir pagando en pesos.
 */
export function regionDesdeCabeceras(
  cookieRegion: string | undefined,
  acceptLanguage: string | undefined
): CodigoRegion {
  if (cookieRegion && cookieRegion in regiones) return cookieRegion as CodigoRegion
  // "es-CO,es;q=0.9" → "CO"
  const pais = acceptLanguage?.split(",")[0]?.split("-")[1]?.toUpperCase()
  return pais && pais in regiones ? (pais as CodigoRegion) : REGION_DEFAULT
}

/** Lo mínimo que se necesita de `cookies()` y `headers()`, sin atarse a Next. */
interface CookiesPeticion {
  get(nombre: string): { value: string } | undefined
}
interface CabecerasPeticion {
  get(nombre: string): string | null
}

/**
 * Qué región se enseña y cuáles se pueden elegir, resuelto de una vez.
 *
 * Vive aquí y no en cada página porque lo necesitan la portada y `/precios`, y
 * son quince líneas con dos decisiones dentro —qué países hay abiertos y qué
 * hacer si el deducido no es uno de ellos—. Copiadas en dos sitios, la segunda
 * copia es la que se queda sin la corrección.
 */
export function regionDeLaPeticion(
  cookiesPeticion: CookiesPeticion,
  cabeceras: CabecerasPeticion,
  paises: PaisOperado[] | null
): { region: CodigoRegion; operados: CodigoRegion[] } {
  // Dónde opera Barion lo decide la API, no una constante de este repositorio:
  // es la MISMA lista que consume el formulario de alta de la aplicación, y por
  // eso los dos no pueden discrepar. Sin respuesta (`null`) no se filtra — se
  // prefiere enseñar de más a esconder la tabla de precios entera.
  const operados = paises
    ? (paises.map((pais) => pais.codigo).filter(esRegionConocida) as CodigoRegion[])
    : REGIONES_CONOCIDAS

  const deducida = regionDesdeCabeceras(
    cookiesPeticion.get(COOKIE_REGION)?.value,
    cabeceras.get("accept-language") ?? undefined
  )

  // Quien llega desde un país cerrado no puede quedarse mirando precios que no
  // se le pueden vender: se le enseña el primero abierto.
  const region = operados.includes(deducida) ? deducida : (operados[0] ?? deducida)

  return { region, operados }
}
