/**
 * Rutas del contrato de la API, relativas a `API_URL`.
 *
 * Juntas y en un solo sitio por la misma razón que `config/rutas.ts`: una ruta
 * escrita a mano dentro de un servicio se queda vieja cuando el contrato
 * cambia, y el fallo aparece como un 404 en producción y no como un error de
 * compilación. Aquí se ven todas de un vistazo contra el Swagger de la api.
 *
 * Solo el CAMINO. Ni el dominio (lo pone `lib/api/cliente.ts` desde el entorno
 * del servidor) ni la caché (la decide cada servicio, que es quien sabe cuánto
 * envejece su dato).
 */
export const endpointsApi = {
  /** Lectura anónima, sin sesión: el catálogo comercial y sus precios. */
  planesPublicos: "/publico/planes",
  /**
   * Dónde opera Barion hoy. Es la MISMA lista que consume el formulario de alta
   * de la aplicación: por eso los dos no pueden discrepar.
   */
  paisesPublicos: "/publico/paises",
} as const
