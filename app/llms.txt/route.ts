import { documentoIndice } from "@/lib/llms"

/**
 * `/llms.txt` — el índice para modelos de lenguaje.
 *
 * La route es delgada a propósito: quién escribe el documento es `lib/llms.ts`,
 * porque el mismo constructor sirve a las dos direcciones (`/llms.txt` y
 * `/llms-full.txt`) y dos copias del texto se desincronizan al primer plan
 * nuevo.
 *
 * `revalidate` igual que los planes (una hora): el resto son constantes del
 * repositorio, que solo cambian con un despliegue.
 */
export const revalidate = 3600

export async function GET(): Promise<Response> {
  return new Response(await documentoIndice(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
