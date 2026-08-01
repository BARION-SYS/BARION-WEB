import { ChevronDown, Mail } from "lucide-react"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import { CORREO_CONTACTO } from "@/config/rutas"
import { gruposPreguntas } from "@/constants/faq"

/**
 * Las objeciones, respondidas justo antes del cierre.
 *
 * Es un acordeón NATIVO (`<details>`/`<summary>`) y no un componente cliente, y
 * las tres razones pesan lo mismo:
 *
 *  · **Se indexa.** La respuesta está en el HTML de origen esté abierta o
 *    cerrada, así que un buscador —y un modelo— la leen entera. Un acordeón de
 *    React que monta el contenido al abrirlo publica una página con quince
 *    preguntas y ninguna respuesta.
 *  · **No cuesta JavaScript.** Esta es la sección más larga de la página y no
 *    añade un solo byte al bundle: abrir y cerrar lo hace el navegador.
 *  · **Ya es accesible.** Teclado, lectores de pantalla y «buscar en la página»
 *    funcionan sin un `aria-` escrito a mano.
 *
 * El `name` por grupo convierte cada bloque en acordeón de uno: al abrir una
 * pregunta se cierra la anterior del MISMO grupo. Donde el navegador no lo
 * soporte quedan todas abiertas a la vez, que es un peor comportamiento, no una
 * página rota.
 *
 * Server Component a propósito — igual que `app/page.tsx`.
 */
export function PreguntasFrecuentes() {
  return (
    <section
      id="preguntas"
      className="scroll-mt-20 border-b border-border bg-background py-24 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-start gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-14">
        {/* La columna que pregunta se queda fija mientras se leen las
            respuestas: en una lista larga, perder el título es perder el sitio */}
        <RevelarEnScroll
          recorrido="izquierda"
          className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
        >
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Preguntas frecuentes
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Lo que se pregunta antes de decidir
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Respondido con lo que Barion hace hoy, incluido lo que no hace. Si falta la tuya,
            escríbenos y la contestamos nosotros.
          </p>
          <a
            href={`mailto:${CORREO_CONTACTO}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Mail className="size-4 text-primary" aria-hidden />
            {CORREO_CONTACTO}
          </a>
        </RevelarEnScroll>

        <div className="flex flex-col gap-10 lg:col-span-8">
          {gruposPreguntas.map((grupo, indice) => (
            <RevelarEnScroll key={grupo.id} retardo={indice * 0.06}>
              <h3 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {grupo.titulo}
              </h3>

              <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {grupo.preguntas.map(({ pregunta, respuesta }) => (
                  <li key={pregunta}>
                    <details name={`faq-${grupo.id}`} className="acordeon-suave group">
                      {/* `list-none` + el pseudoelemento de WebKit: el triángulo
                          del navegador compite con el signo de la derecha */}
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-5 transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                        <h4 className="text-base font-medium text-balance">{pregunta}</h4>
                        <ChevronDown
                          className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-primary"
                          aria-hidden
                        />
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:pr-16">
                        {respuesta}
                      </p>
                    </details>
                  </li>
                ))}
              </ul>
            </RevelarEnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
