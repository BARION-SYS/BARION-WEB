import { documentoCompleto } from "@/lib/llms"

/**
 * `/llms-full.txt` — el sitio entero en texto plano.
 *
 * Respondía 404. Existe porque `/llms.txt` es un índice de enlaces por
 * convención, y un asistente que va a responder «¿cuánto cuesta Barion?»
 * necesita el contenido, no la lista de direcciones donde ir a buscarlo: una
 * petición en vez de cinco.
 */
export const revalidate = 3600

export async function GET(): Promise<Response> {
  return new Response(await documentoCompleto(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
