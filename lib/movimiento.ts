/**
 * Cómo entra en pantalla lo que aparece al desplazar. **Una sola receta.**
 *
 * ── Qué se cambió, y por qué ────────────────────────────────────────────────
 * Las entradas eran un resorte (stiffness 140, damping 22) con 28-32 px de
 * recorrido y se disparaban en cuanto un cuarto del bloque asomaba. Un resorte
 * así sale disparado y se asienta en medio segundo: al bajar por la página,
 * cada sección se «encendía» de golpe justo en el borde de la pantalla, antes
 * de que la vista llegara, y todo parecía pasar a la vez.
 *
 * Además el retardo de cada tarjeta no se aplicaba: la transición declarada en
 * la variante gana a la del componente, así que el `delay` que escalonaba los
 * pasos se perdía y las tres tarjetas entraban juntas.
 *
 * Ahora es una curva de salida larga y un recorrido corto: el bloque ya está
 * casi en su sitio desde el primer fotograma y lo que se nota es cómo termina
 * de asentarse. Y se dispara un poco más arriba del borde, cuando el bloque ya
 * está donde se mira.
 *
 * ── Por qué aquí y no en cada sección ───────────────────────────────────────
 * Por lo mismo que `superficies.ts`: con la curva copiada en cada componente,
 * una sección acaba entrando distinto a la de al lado y el sitio se lee como
 * hecho por dos personas.
 */

/** Salida suave: arranca rápido pero sin salto y se asienta despacio. */
export const CURVA_SUAVE = [0.22, 1, 0.36, 1] as const

/** La transición de toda entrada por scroll. Larga a propósito: es marketing, no una interfaz. */
export const TRANSICION_REVELAR = { duration: 1, ease: CURVA_SUAVE } as const

/** Cuánto se desplaza lo que entra. Poco: el movimiento acompaña, no protagoniza. */
export const RECORRIDO_REVELAR = 20

/** Cuánto separa la entrada de dos hermanos. Lo bastante para leerse como secuencia. */
export const CASCADA_REVELAR = 0.12

/**
 * Cuándo se dispara: con el bloque ya un 15 % por encima del borde inferior.
 *
 * Es un margen y no un `amount` a propósito: un umbral por porcentaje del propio
 * bloque se comporta distinto según lo alto que sea —una tarjeta baja se
 * disparaba en el borde, un bloque alto en el móvil tardaba en cumplirlo—; un
 * margen del viewport es el mismo punto de la pantalla para todo.
 */
export const VISTA_REVELAR = { once: true, margin: "0px 0px -15% 0px" } as const
