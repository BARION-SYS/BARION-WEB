import "server-only"
import { z } from "zod"

/**
 * Variables que NO salen del servidor.
 *
 * `server-only` no es documentación: si un componente cliente importa este
 * archivo —directamente o a través de tres intermediarios— el build FALLA con
 * el nombre del archivo culpable. Es la única forma de que la regla aguante
 * seis meses; un comentario que dice «no importar esto en el cliente» no la
 * hace cumplir.
 *
 * La dirección de la API vive aquí, y sin prefijo `NEXT_PUBLIC_`, a propósito:
 * el navegador no tiene por qué saber dónde está la API de Barion. Habla
 * siempre con este mismo sitio (`/api/…`), y es el servidor quien va a buscar
 * el dato. Eso quita el CORS, quita la URL del bundle y deja mover la API de
 * sitio sin recompilar el frontal.
 */
const esquema = z.object({
  // URL de la API vista DESDE EL SERVIDOR de Next, con prefijo /api y versión
  // /v1: sin el /api toda petición responde 404 y parece un problema de
  // permisos de origen cruzado.
  //
  // SIN valor de reserva. Uno apuntando a localhost es peor que ninguno:
  // desplegado tras un dominio, la petición saldría contra la máquina
  // equivocada y el fallo aparecería como una red caída en vez de como
  // configuración ausente. Sin la variable esto revienta al arrancar, que es
  // cuando se puede arreglar.
  API_URL: z.url(),
  /**
   * Los códigos de verificación de propiedad: Google Search Console y Bing
   * Webmaster Tools.
   *
   * Van aquí y NO con prefijo `NEXT_PUBLIC_` aunque acaben escritos en el HTML:
   * quien los pinta es `generateMetadata`, que corre en el servidor. Con prefijo
   * viajarían además dentro del bundle, donde no los lee nadie.
   *
   * Opcionales por la misma razón que `NEXT_PUBLIC_SITE_URL`: sin ellos NO se
   * pinta la etiqueta, en vez de publicar una vacía —que es lo que hace fallar la
   * verificación con un mensaje que no dice por qué—. La verificación por DNS no
   * los necesita; existen para sobrevivir a que alguien mueva el DNS sin avisar.
   */
  GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),
  BING_SITE_VERIFICATION: z.string().min(1).optional(),
})

const variables = esquema.parse({
  API_URL: process.env.API_URL,
  // `|| undefined` y no a secas: una variable declarada y vacía en el `.env`
  // llega como `""`, y `""` no es «no configurado» para zod — es una cadena que
  // falla el `min(1)` y tumba el arranque por un renglón en blanco.
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  BING_SITE_VERIFICATION: process.env.BING_SITE_VERIFICATION || undefined,
})

export const envServidor = {
  apiUrl: variables.API_URL,
  verificacionGoogle: variables.GOOGLE_SITE_VERIFICATION,
  verificacionBing: variables.BING_SITE_VERIFICATION,
} as const
