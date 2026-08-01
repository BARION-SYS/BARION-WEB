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
})

const variables = esquema.parse({
  API_URL: process.env.API_URL,
})

export const envServidor = {
  apiUrl: variables.API_URL,
} as const
