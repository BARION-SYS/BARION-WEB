import { REGION_DEFAULT, regiones, type CodigoRegion } from "@/config/regiones"

/** Nombre de la cookie que recuerda el país elegido a mano en la landing. */
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

/** Etiqueta del selector: país y moneda juntos — «Colombia (COP)». */
export const nombresDeRegion: Record<CodigoRegion, string> = {
  CO: "Colombia",
  US: "Estados Unidos",
  ES: "España",
}

/** Límite sin techo (`null`) dicho en lenguaje humano, no con un guion. */
export function textoLimite(cantidad: number | null, singular: string, plural: string): string {
  if (cantidad === null) return `${plural} sin límite`
  return cantidad === 1 ? `1 ${singular}` : `Hasta ${cantidad} ${plural}`
}
