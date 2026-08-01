import "server-only"
import { envServidor } from "@/config/env.server"

/**
 * El único sitio del repositorio que habla con la API de Barion.
 *
 * EXCEPCIÓN CONSCIENTE a «todo el HTTP pasa por `ApiClient`». Ese es el cliente
 * de la APLICACIÓN: axios con `withCredentials`, pensado para la sesión del
 * navegador. Esto es otra cosa —lecturas anónimas que ocurren EN EL SERVIDOR,
 * para que el buscador vea el contenido y la página no parpadee—, así que no
 * comparte transporte: `fetch` a secas, sin cookies, sin interceptores y sin
 * una dependencia que engorde el bundle de una landing.
 *
 * Tres cosas que ningún `fetch` suelto trae y que aquí se dan por hechas:
 * el dominio sale del entorno del servidor y nunca del componente; la espera
 * está acotada; y un fallo llega como `ErrorApi` con su estado, no como un
 * `TypeError` genérico del que no se puede decidir nada.
 */

/** Un fallo al hablar con la API, con la forma suficiente para decidir. */
export class ErrorApi extends Error {
  constructor(
    /** Estado HTTP. `0` = no hubo respuesta (red caída, DNS, tiempo agotado). */
    readonly estado: number,
    readonly ruta: string,
    mensaje: string
  ) {
    super(mensaje)
    this.name = "ErrorApi"
  }

  /** No respondió nadie: distinto de «respondió y dijo que no». */
  get sinRespuesta(): boolean {
    return this.estado === 0
  }
}

interface OpcionesLectura {
  /**
   * Segundos que Next sirve la respuesta cacheada. Obligatorio: una lectura
   * sin política de caché acaba pegándole a la API en cada visita, y estas
   * páginas se renderizan en el servidor para todo el que pase.
   */
  revalidate: number
  /** Corta la espera. Una API lenta no puede dejar la landing sin pintar. */
  timeoutMs?: number
}

/**
 * Cuatro segundos. Es más de lo que tarda una lectura sana y menos de lo que
 * un visitante aguanta mirando una página en blanco: pasado ese punto, al
 * servicio le sale mejor su respaldo que la respuesta buena.
 */
const TIMEOUT_POR_DEFECTO_MS = 4000

/** GET a la API. Devuelve el cuerpo SIN tipar — validarlo es del servicio. */
export async function leerJson(ruta: string, opciones: OpcionesLectura): Promise<unknown> {
  const url = `${envServidor.apiUrl}${ruta}`

  let respuesta: Response
  try {
    respuesta = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(opciones.timeoutMs ?? TIMEOUT_POR_DEFECTO_MS),
      next: { revalidate: opciones.revalidate },
    })
  } catch (causa) {
    // Red caída, DNS, tiempo agotado: no hay estado que leer.
    const motivo = causa instanceof Error ? causa.message : String(causa)
    throw new ErrorApi(0, ruta, `sin respuesta de la API: ${motivo}`)
  }

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, ruta, `la API respondió ${respuesta.status}`)
  }

  try {
    return (await respuesta.json()) as unknown
  } catch {
    throw new ErrorApi(respuesta.status, ruta, "la API respondió algo que no es JSON")
  }
}
