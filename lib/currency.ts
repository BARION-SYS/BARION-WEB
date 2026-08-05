import type { CodigoMoneda } from "@/config/regiones"

// Dinero: la API SIEMPRE entrega unidad menor (centavos) + código ISO 4217.
// Nunca floats. El formateo según moneda y locale ocurre solo aquí.

/** Locale de reserva — la landing formatea con el de la región que se mira. */
export const LOCALE_DEFAULT = "es-CO"

/**
 * Cuántos ceros separan lo que guarda la API de lo que se lee: el exponente de
 * la unidad menor según ISO 4217. Para las tres monedas de Barion es 2 —el
 * peso, el dólar y el euro se guardan en centavos—.
 *
 * ESTO NO SON LOS DECIMALES QUE SE PINTAN, y confundirlos cuesta un factor
 * cien. El peso colombiano lo enseña todo el mundo sin decimales (CLDR dice 0)
 * pero ISO le da unidad menor de 2: 8 900 000 centavos son $ 89.000, no
 * $ 8.900.000. Los decimales visibles los decide el formateador; la escala,
 * esta tabla, y solo esta.
 *
 * Moneda nueva = entrada aquí. Sin ella, TypeScript no compila — que es
 * exactamente lo que se quiere de un dato del que depende un precio.
 */
const escalaPorMoneda: Record<CodigoMoneda, number> = {
  COP: 2,
  USD: 2,
  EUR: 2,
}

/**
 * Cuántos decimales se PINTAN. Nada que ver con la escala de arriba.
 *
 * Estos valores son los de CLDR —el peso colombiano no lleva decimales, el
 * dólar y el euro sí— pero se declaran aquí en vez de dejárselos al formateador,
 * y el motivo no es estético: **`Intl` no da el mismo resultado en el servidor
 * que en el navegador**. Cada uno trae su propia versión de ICU y los datos de
 * moneda cambian entre versiones. Con Node 22 (ICU 78) el servidor emitía
 * `$ 1.280.000` y el navegador `$ 1.280.000,00` para el mismo importe: React ve
 * dos textos distintos, falla la hidratación y **vuelve a renderizar el árbol
 * entero en el cliente**, que es lo que además hacía saltar el aviso del
 * `<script>` de next-themes.
 *
 * Un importe que se sirve renderizado no puede depender de qué ICU tenga
 * delante. Moneda nueva = entrada aquí, igual que en la escala.
 */
const decimalesPorMoneda: Record<CodigoMoneda, number> = {
  COP: 0,
  USD: 2,
  EUR: 2,
}

// Formateadores Intl memoizados por locale+opciones — nunca crear por render.
const formatos = new Map<string, Intl.NumberFormat>()

function getNumberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const clave = `${locale}|${JSON.stringify(options)}`
  let formato = formatos.get(clave)
  if (!formato) {
    formato = new Intl.NumberFormat(locale, options)
    formatos.set(clave, formato)
  }
  return formato
}

/** De unidad menor a unidad mayor. El único sitio donde se divide. */
function aUnidadMayor(amountMinor: number, currency: CodigoMoneda): number {
  return amountMinor / 10 ** escalaPorMoneda[currency]
}

/**
 * El mismo importe como NÚMERO en unidad mayor, sin símbolo ni separadores.
 *
 * Es lo que pide `schema.org/Offer`: `price` tiene que ser una cifra que una
 * máquina pueda comparar («89000.00»), y la moneda va aparte en
 * `priceCurrency`. Formatear con `formatMoney` y publicar «$ 89.000» ahí deja
 * el precio ilegible para el buscador — y el precio es lo único de esta página
 * que se compara con el de otro.
 *
 * Lleva SIEMPRE los decimales de la escala, no los de la costumbre local: un
 * dato estructurado se lee igual desde cualquier país.
 */
export function montoDecimal(amountMinor: number, currency: CodigoMoneda): string {
  return aUnidadMayor(amountMinor, currency).toFixed(escalaPorMoneda[currency])
}

/**
 * El importe para leer. Los decimales salen de `decimalesPorMoneda` y **se le
 * imponen al formateador**: dejárselos a CLDR daba un texto en el servidor y
 * otro en el navegador, y eso rompe la hidratación de una página que se sirve
 * renderizada.
 *
 * Que se fijen aquí no reabre el error del factor cien: lo que se pinta y lo que
 * se divide siguen siendo dos tablas separadas, y quien divide es
 * `aUnidadMayor` con `escalaPorMoneda`.
 */
export function formatMoney(
  amountMinor: number,
  currency: CodigoMoneda,
  locale = LOCALE_DEFAULT
): string {
  const decimales = decimalesPorMoneda[currency]
  return getNumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(aUnidadMayor(amountMinor, currency))
}
