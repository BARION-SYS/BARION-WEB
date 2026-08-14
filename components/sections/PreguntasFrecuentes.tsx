import { useTranslations } from "next-intl"
import { ChevronDown, Mail } from "lucide-react"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import { EncabezadoSeccion } from "@/components/sections/EncabezadoSeccion"
import { CLAVES_GRUPO_PREGUNTAS, preguntasPorGrupo, type ClavePregunta } from "@/config/contenido"
import { Seccion } from "@/components/sections/Seccion"
import { CORREO_CONTACTO } from "@/config/rutas"

interface PreguntasFrecuentesProps {
  nivel?: "h1" | "h2"
  /**
   * Cuántas enseñar. En la portada, un puñado; en su página, todas.
   *
   * Recortar en la portada no es esconder: un `FAQPage` declarado sobre una
   * página que enseña cuatro de dieciocho promete un contenido que esa dirección
   * no tiene, y el JSON-LD se publica solo en la página completa por eso mismo.
   */
  limite?: number
  enlace?: { href: string; texto: string }
  tono?: "base" | "alterno"
  separador?: boolean
}

/**
 * Las objeciones, respondidas.
 *
 * Es un acordeón NATIVO (`<details>`/`<summary>`) y no un componente cliente, y
 * las tres razones pesan lo mismo:
 *
 *  · **Se indexa.** La respuesta está en el HTML de origen esté abierta o
 *    cerrada, así que un buscador —y un modelo— la leen entera. Un acordeón de
 *    React que monta el contenido al abrirlo publica una página con quince
 *    preguntas y ninguna respuesta.
 *  · **No cuesta JavaScript.** Es la sección más larga y no añade un solo byte
 *    al bundle: abrir y cerrar lo hace el navegador.
 *  · **Ya es accesible.** Teclado, lectores de pantalla y «buscar en la página»
 *    funcionan sin un `aria-` escrito a mano.
 *
 * El `name` por grupo convierte cada bloque en acordeón de uno: al abrir una
 * pregunta se cierra la anterior del MISMO grupo. Donde el navegador no lo
 * soporte quedan todas abiertas a la vez, que es un peor comportamiento, no una
 * página rota.
 */
export function PreguntasFrecuentes({
  nivel = "h2",
  limite,
  enlace,
  tono = "alterno",
  separador = true,
}: PreguntasFrecuentesProps) {
  const t = useTranslations("preguntas")
  // Con límite se sirve una sola lista sin grupos: cuatro preguntas repartidas
  // en tres títulos se leen como tres secciones a medias.
  const recortadas: ClavePregunta[] | null = limite
    ? CLAVES_GRUPO_PREGUNTAS.flatMap((grupo) => preguntasPorGrupo[grupo]).slice(0, limite)
    : null

  const grupos = recortadas
    ? [{ clave: "empezar" as const, titulo: null, preguntas: recortadas }]
    : CLAVES_GRUPO_PREGUNTAS.map((clave) => ({
        clave,
        titulo: t(`grupos.${clave}`),
        preguntas: [...preguntasPorGrupo[clave]],
      }))

  return (
    <Seccion tono={tono} separador={separador}>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* La columna que pregunta se queda fija mientras se leen las
            respuestas: en una lista larga, perder el título es perder el sitio */}
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <EncabezadoSeccion
            etiqueta={t("etiqueta")}
            titulo={t("titulo")}
            entrada={t("entrada")}
            nivel={nivel}
            enlace={enlace}
            className="lg:flex-col lg:items-start lg:justify-start lg:gap-6"
          />
          <a
            href={`mailto:${CORREO_CONTACTO}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Mail className="size-4 text-primary" aria-hidden />
            {CORREO_CONTACTO}
          </a>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-8">
          {grupos.map((grupo, indice) => (
            <RevelarEnScroll key={grupo.clave} retardo={indice * 0.06}>
              {grupo.titulo && (
                <h3 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {grupo.titulo}
                </h3>
              )}

              <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {grupo.preguntas.map((clave) => {
                  const pregunta = t(`lista.${clave}.pregunta`)
                  const respuesta = t(`lista.${clave}.respuesta`)
                  return (
                    <li key={clave}>
                      <details name={`faq-${grupo.clave}`} className="acordeon-suave group">
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
                  )
                })}
              </ul>
            </RevelarEnScroll>
          ))}
        </div>
      </div>
    </Seccion>
  )
}
