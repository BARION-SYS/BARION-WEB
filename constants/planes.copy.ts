/**
 * El texto de venta de cada plan. **Vive aquí y no en la API**, y es una
 * decisión, no una carencia.
 *
 * La API es dueña de lo que un plan ES —cuánto cuesta en cada país, cuántas
 * sedes admite, qué funciones habilita—. Esto es cómo se CUENTA, y cambia por
 * razones distintas: una prueba A/B del titular, una palabra que convierte
 * mejor, una promesa que legal quiere matizar. Nada de eso debería exigir
 * tocar la base de datos ni desplegar la API.
 *
 * Hay además una razón concreta: en la base, `funciones` son **banderas de
 * producto** (`{ campanas: true }`) y de ellas depende si el módulo está
 * encendido. Convertirlas en frases ataría un cambio de redacción a la lógica de
 * negocio, y el día que alguien "mejore el copy" apagaría una función.
 *
 * El día que exista el panel para administrar planes, `descripcion` y
 * `destacado` pasarán a la base y este archivo se quedará solo con el
 * diccionario de funciones — el servicio ya está preparado para eso.
 */

/** Lo que la API llama `agenda`, dicho para quien compra. */
export const copyFunciones: Record<string, string> = {
  agenda: "Agenda con reserva en línea",
  portal: "Escaparate público con tu enlace",
  recordatorios: "Recordatorios de cita",
  clientes: "Ficha de clientes e historial",
  comisiones: "Comisiones por barbero",
  campanas: "Campañas de cumpleaños y reactivación",
  fidelidad: "Programa de fidelidad",
  listaEspera: "Lista de espera",
  reportes: "Estadísticas de ocupación e ingresos",
  multisede: "Varias sedes",
}

interface CopyPlan {
  descripcion: string
  /** El que la tabla resalta. Uno solo: dos destacados no destacan. */
  destacado: boolean
}

export const copyPlanes: Record<string, CopyPlan> = {
  esencial: {
    descripcion: "Para la barbería de un local que quiere dejar el cuaderno.",
    destacado: false,
  },
  pro: {
    descripcion: "Para la barbería con equipo, varias sedes y clientes que vuelven.",
    destacado: true,
  },
}

/**
 * Un plan que la API publique y aquí no esté **se sigue enseñando**: el precio
 * es lo que importa y una descripción vacía es mejor que un hueco en la tabla.
 * Lo mismo con una función sin traducir — se muestra su clave antes que
 * desaparecer, porque desaparecer es lo único que el visitante no puede notar.
 */
export function copyDe(codigo: string): CopyPlan {
  return copyPlanes[codigo] ?? { descripcion: "", destacado: false }
}

export function fraseDeFuncion(clave: string): string {
  return copyFunciones[clave] ?? clave
}
