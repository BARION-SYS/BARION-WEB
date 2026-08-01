import { NextResponse } from "next/server"
import { obtenerPlanesPublicos } from "@/services/planes"

/**
 * `/api/planes` — la única puerta por la que el NAVEGADOR puede pedir planes.
 *
 * Es un intermediario delgado sobre la API de Barion, y existe por tres cosas
 * que no se arreglan con un `fetch` directo desde el cliente:
 *
 *  · **El navegador no aprende dónde está la API.** Pide a este mismo dominio;
 *    quién esté detrás es asunto del servidor. Mover la API de sitio no obliga
 *    a recompilar el frontal, y nadie descubre el host interno abriendo el
 *    inspector.
 *  · **No hay permisos de origen cruzado que negociar.** Mismo origen, sin
 *    `preflight` y sin lista de dominios que mantener en la api.
 *  · **La caché es de este sitio.** La respuesta se guarda una hora aquí, así
 *    que mil visitas no son mil peticiones a la api.
 *
 * Devuelve `{ data }`, la MISMA envoltura del contrato de la api: si algún día
 * el cliente pasa a hablar con ella directamente, no cambia nada más que la
 * dirección. Y como pasa por `services/planes`, hereda su validación y su
 * respaldo — nunca contesta con algo fuera de contrato.
 *
 * Hoy no lo consume nadie: la landing resuelve los planes en el servidor, que
 * es lo correcto para lo que tiene que posicionar. Está para que el primer
 * componente cliente que necesite el dato tenga a dónde ir sin que a nadie se
 * le ocurra volver a publicar la URL de la API en el bundle.
 */
export const revalidate = 3600

export async function GET(): Promise<NextResponse> {
  const data = await obtenerPlanesPublicos()

  return NextResponse.json(
    { data },
    {
      headers: {
        // Que también la cachee el proxy de delante, y que sirva la copia
        // vieja mientras revalida en vez de dejar esperando a nadie.
        "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  )
}
