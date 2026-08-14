/**
 * Las recetas visuales que se repiten. **Clases, no componentes.**
 *
 * ── Por qué existen ─────────────────────────────────────────────────────────
 * Medido antes de escribir esto: la misma idea de «tarjeta» estaba escrita con
 * cuatro paddings distintos (`p-5`, `p-6`, `p-7`, `p-3`) y **seis recetas de
 * hover** —unas movían la tarjeta, otras solo el borde, otras la sombra—. Nada
 * de eso se ve como un error al mirar una sección; se ve al mirar dos seguidas,
 * y entonces el sitio parece hecho por dos personas que no hablaron.
 *
 * ── Por qué clases y no un componente `<Tarjeta>` ───────────────────────────
 * Porque estas superficies son cosas distintas por dentro: una es un `<li>`, otra
 * un `<Link>`, otra un `<div>` con una rejilla. Envolverlas en un componente
 * obligaría a un `as` o a un `render` para nada — lo único que comparten es el
 * aspecto, y eso es exactamente lo que una clase sabe compartir.
 *
 * Se componen con `cn()`, así que cualquier sección puede añadir lo suyo encima
 * sin pelearse con lo de aquí.
 */

/** Superficie base: el fondo, el borde y el radio de una tarjeta del sitio. */
export const TARJETA = "rounded-2xl border border-border bg-card"

/**
 * Aire de una tarjeta. Un solo valor, que sube un paso en pantalla grande.
 *
 * Antes iba de `p-5` a `p-7` según quién la escribiera. La diferencia es de ocho
 * píxeles y no se nota sola: se nota cuando dos tarjetas de secciones distintas
 * caen a la misma altura y una respira más que la otra.
 */
export const TARJETA_AIRE = "p-6 sm:p-7"

/**
 * Cómo responde una tarjeta que se puede pulsar.
 *
 * **Una sola receta**: el borde se tiñe de marca, la sombra sube y la tarjeta se
 * levanta un píxel. El levantamiento va tras `motion-safe:` porque quien pide
 * menos movimiento no tiene por qué recibirlo, y el anillo de foco está aquí
 * dentro a propósito — separarlo es cómo la mitad de las tarjetas acababa sin
 * él, invisible para quien navega con teclado.
 */
export const TARJETA_PULSABLE =
  "transition-[border-color,box-shadow,transform] duration-300 " +
  "hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-1 " +
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"

/**
 * Una tarjeta que reacciona pero NO es un enlace (las de valor, las de plan).
 *
 * Igual que la anterior menos el anillo: sin destino no hay foco que recibir, y
 * un anillo en algo que el teclado no alcanza es ruido.
 */
export const TARJETA_VIVA =
  "transition-[border-color,box-shadow,transform] duration-300 " +
  "hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-1"

/**
 * El ancho de todo lo que se lee en este sitio y sus márgenes laterales.
 *
 * Estaba copiado en las seis secciones, y con él la decisión de cuánto aire hay
 * a los lados en cada tamaño. Un sitio donde una sección respira 24 px y la de
 * abajo 56 px se lee torcido sin que se pueda señalar dónde.
 */
export const CONTENEDOR = "mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14"

/**
 * El numerito de un paso.
 *
 * Existe porque el mismo concepto se pintaba de tres formas: número claro sobre
 * oro en la vista previa, «Paso 1» en texto gris en el cierre, y un ordinal
 * editorial en los bloques de valor. Los dos primeros son lo mismo —una
 * secuencia— y ahora se ven igual; el tercero se queda distinto **a propósito**,
 * porque no es una secuencia: son tres cosas que pasan a la vez.
 */
export const PASO =
  "flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground tabular-nums"
