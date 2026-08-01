interface DatosEstructuradosProps {
  /** El grafo de schema.org. `null` cuando no hay dominio público configurado. */
  datos: Record<string, unknown> | null
}

/**
 * Publica un grafo JSON-LD en el HTML de origen.
 *
 * Va como `<script type="application/ld+json">` y no como atributos repartidos
 * por el marcado: es lo que buscadores y modelos leen sin ejecutar nada, y
 * llega en la respuesta del servidor, que es la única que ve un rastreador que
 * no corre JavaScript.
 *
 * El `<` escapado no es paranoia de manual: basta con que una respuesta de las
 * preguntas frecuentes contenga `</script>` para que el navegador cierre la
 * etiqueta ahí y trate el resto del grafo como marcado.
 */
export function DatosEstructurados({ datos }: DatosEstructuradosProps) {
  if (!datos) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  )
}
