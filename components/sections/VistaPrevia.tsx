import { useTranslations } from "next-intl"
import { CalendarDays, CalendarPlus, Check, Users } from "lucide-react"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import { EncabezadoSeccion } from "@/components/sections/EncabezadoSeccion"
import { EscaparateDemo } from "@/components/sections/EscaparateDemo"
import { Seccion } from "@/components/sections/Seccion"
import { TramoDePaso } from "@/components/sections/TramoDePaso"
import { CLAVES_PASO, iconosPaso } from "@/config/contenido"
import { CASCADA_REVELAR } from "@/lib/movimiento"
import { PASO } from "@/lib/superficies"
import { cn } from "@/lib/utils"
import { envPublico } from "@/config/env.public"
import type { CodigoRegion } from "@/config/regiones"

/**
 * La dirección que se lee en la barra de la maqueta.
 *
 * Sale del dominio real de la aplicación y no de una constante escrita a mano,
 * por lo mismo que en el resto del sistema: un dominio cableado enseña uno que
 * no existe en cuanto el despliegue vive en otro sitio, y quien lo teclee no
 * llega a ninguna parte. Sin `host` legible se cae a la ruta sola, que sigue
 * siendo cierta.
 */
function direccionDelPanel(): string {
  const ruta = "/dashboard/citas"
  try {
    return `${new URL(envPublico.appUrl).host}${ruta}`
  } catch {
    return ruta
  }
}

interface VistaPreviaProps {
  region: CodigoRegion
  nivel?: "h1" | "h2"
  /** En la portada, solo los tres pasos y el panel. La página de reservas jugable vive en su página. */
  resumen?: boolean
  enlace?: { href: string; texto: string }
  tono?: "base" | "alterno"
  separador?: boolean
}

/**
 * Cómo llega una cita: los tres pasos, el panel donde aterriza y —en su página—
 * la página de reservas jugable.
 *
 * ── Qué se rehízo, y por qué ────────────────────────────────────────────────
 * Eran tres tarjetas iguales en fila y, debajo, el panel a todo el ancho. Tres
 * tarjetas del mismo peso se leen como tres cosas sueltas, no como una
 * secuencia, y el panel quedaba lejos de lo que lo explicaba.
 *
 * Ahora es **una línea de tiempo al lado de lo que produce**:
 *
 *  · **Izquierda** — los pasos en vertical, cada uno con quién lo hace (tú, tu
 *    cliente, el sistema). El hilo entre ellos se llena al ritmo del scroll
 *    (`TramoDePaso`): la secuencia se lee, no se deduce.
 *  · **Derecha** — el panel en su doble marco, y encima el aviso de una reserva
 *    que acaba de entrar. La fila de esa cita aparece la última: es el paso tres
 *    ocurriendo delante de quien lee.
 *
 * En su página se añade una segunda fila, en zigzag: el teléfono jugable a la
 * izquierda y lo que tiene que probar a la derecha.
 *
 * ── Por qué «página de reservas» y no «escaparate» ──────────────────────────
 * En Colombia «escaparate» no dice nada: se entiende como la vitrina de una
 * tienda, no como una página donde se reserva. El dueño de una barbería lo que
 * tiene es un enlace que manda por WhatsApp, y así se nombra en todo el texto.
 * En el código sigue llamándose escaparate, que es el nombre del dominio en el
 * sistema entero.
 *
 * No son capturas: una imagen del producto envejece al día siguiente de cada
 * cambio de UI y pesa. Construidos con los mismos tokens del tema, se ven
 * correctos en claro y en oscuro y no cuestan una petición de red.
 */
export function VistaPrevia({
  region,
  nivel = "h2",
  resumen = false,
  enlace,
  tono = "alterno",
  separador = true,
}: VistaPreviaProps) {
  const t = useTranslations("vistaPrevia")
  // Un nivel por debajo del de la sección, siempre derivado: escrito fijo, en la
  // página propia salían `h3` colgando directamente de un `h1`.
  const Subtitulo = nivel === "h1" ? "h2" : "h3"
  // `raw` porque es una lista, no una frase.
  const puntosDePrueba = t.raw("prueba.puntos") as string[]

  return (
    <Seccion tono={tono} separador={separador}>
      <EncabezadoSeccion
        etiqueta={t("etiqueta")}
        titulo={t("titulo")}
        entrada={t("entrada")}
        nivel={nivel}
        enlace={enlace}
      />

      <div className="mt-12 grid grid-cols-1 items-center gap-16 sm:mt-16 lg:grid-cols-12 lg:gap-16 xl:gap-24">
        {/* ── Los pasos ─────────────────────────────────────────────────── */}
        {/* El envoltorio de la animación ES el `<li>`: un `<div>` entre la
            lista y sus elementos dejaba de ser una lista para un lector de
            pantalla. */}
        <ol className="lg:col-span-5">
          {CLAVES_PASO.map((clave, indice) => {
            const Icono = iconosPaso[clave]
            const ultimo = indice === CLAVES_PASO.length - 1
            return (
              <RevelarEnScroll
                key={clave}
                como="li"
                retardo={indice * CASCADA_REVELAR}
                className="flex gap-5 sm:gap-6"
              >
                {/* El número y, debajo, el hilo hasta el siguiente. El hilo
                    ocupa lo que mida el texto de su paso, así que siempre llega
                    al número de abajo. */}
                <div className="flex flex-col items-center">
                  <span className={PASO} aria-hidden>
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  {!ultimo && <TramoDePaso className="my-2 flex-1" />}
                </div>

                <div className={cn("min-w-0 pt-1.5", !ultimo && "pb-10 sm:pb-12")}>
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Icono className="size-3.5" aria-hidden />
                    {t(`pasos.${clave}.quien`)}
                  </p>
                  <Subtitulo className="mt-2 text-lg font-semibold tracking-tight text-balance sm:text-xl">
                    {t(`pasos.${clave}.titulo`)}
                  </Subtitulo>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-pretty text-muted-foreground sm:text-[0.9375rem]">
                    {t(`pasos.${clave}.descripcion`)}
                  </p>
                </div>
              </RevelarEnScroll>
            )
          })}
        </ol>

        {/* ── Donde aterriza ────────────────────────────────────────────── */}
        <RevelarEnScroll retardo={0.1} className="lg:col-span-7">
          <Escenario>
            <MarcoPanel />
          </Escenario>
        </RevelarEnScroll>
      </div>

      {/* ── La página de reservas, jugable ──────────────────────────────── */}
      {!resumen && (
        <div className="mt-20 grid grid-cols-1 items-center gap-12 border-t border-border pt-16 sm:mt-28 sm:pt-24 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          <RevelarEnScroll className="lg:order-2 lg:col-span-5">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              {t("prueba.etiqueta")}
            </p>
            <Subtitulo className="mt-3 text-2xl leading-tight font-bold tracking-tight text-balance sm:mt-4 sm:text-3xl lg:text-4xl">
              {t("prueba.titulo")}
            </Subtitulo>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:mt-5 sm:text-lg">
              {t("prueba.entrada")}
            </p>
            <ul className="mt-7 space-y-3 border-t border-border pt-6">
              {puntosDePrueba.map((punto) => (
                <li key={punto} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span className="text-muted-foreground">{punto}</span>
                </li>
              ))}
            </ul>
          </RevelarEnScroll>

          <RevelarEnScroll retardo={0.1} className="lg:order-1 lg:col-span-7">
            <Escenario>
              <figure>
                <EscaparateDemo region={region} />
                <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                  {t("prueba.pie")}
                </figcaption>
              </figure>
            </Escenario>
          </RevelarEnScroll>
        </div>
      )}
    </Seccion>
  )
}

/**
 * El suelo de una maqueta: una retícula de puntos que se desvanece hacia los
 * bordes y un halo del oro de marca detrás.
 *
 * Sin él la maqueta flotaba sobre un fondo liso y se leía como una captura
 * pegada. Son dos degradados, sin imagen y sin `blur`: un desenfoque grande en
 * algo que se desplaza se repinta en cada fotograma, y en un móvil se nota.
 */
function Escenario({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <div
        className="pointer-events-none absolute -inset-4 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_72%)] [background-size:20px_20px] sm:-inset-10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-[8%] inset-y-[12%] -z-10 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
        aria-hidden
      />
      {children}
    </div>
  )
}

/** Los nombres de persona no se traducen: traducir un nombre es inventárselo. */
const filas = [
  { hora: "09:00", cliente: "Andrés Villa", servicio: "corteBarba", barbero: "Iván", nueva: false },
  { hora: "10:30", cliente: "Julián Mesa", servicio: "fadeClasico", barbero: "Duván", nueva: true },
  { hora: "11:30", cliente: "Samuel Ríos", servicio: "navaja", barbero: "Iván", nueva: false },
  { hora: "12:15", cliente: "Mateo Cano", servicio: "corteNino", barbero: "Duván", nueva: false },
] as const

/** La cita que acaba de entrar: la misma que cuenta el aviso. */
const reservaNueva = filas.find((fila) => fila.nueva) ?? filas[0]

/**
 * El panel, en doble marco: una bandeja con su propio borde y, dentro, la
 * ventana. Los dos radios son concéntricos —el de dentro es el de fuera menos
 * el aire—; con el mismo radio en los dos, las esquinas se ven torcidas.
 *
 * La coreografía es la historia del paso tres, y va lenta a propósito: entra el
 * panel, después el aviso de la reserva y por último la fila de esa cita.
 */
function MarcoPanel() {
  const t = useTranslations("vistaPrevia.maqueta")
  const pie = useTranslations("vistaPrevia")
  const servicio = useTranslations("maquetas.servicios")

  return (
    <figure>
      <div className="relative">
        <div className="rounded-[1.75rem] border border-border bg-secondary/70 p-1.5 shadow-[0_40px_80px_-40px_var(--sombra)] sm:p-2">
          <div className="overflow-hidden rounded-[1.375rem] border border-border bg-card sm:rounded-[1.25rem]">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
              </div>
              <span className="ml-2 truncate rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                {direccionDelPanel()}
              </span>
            </div>

            <div className="p-4 sm:p-6">
              {/* Un párrafo y no un encabezado: es texto DENTRO de un dibujo, y
                  un título ahí se colaba en el índice de la página. */}
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold">{t("citasDeHoy")}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
                  <CalendarDays className="size-3" aria-hidden />
                  {t("dia")}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Users className="size-3.5" aria-hidden />
                  {t("barberosEnSilla")}
                </span>
              </div>

              <ul className="mt-4 divide-y divide-border">
                {filas.map((fila) => {
                  const contenido = (
                    <>
                      <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                        {fila.hora}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{fila.cliente}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {servicio(fila.servicio)} · {fila.barbero}
                        </span>
                      </span>
                    </>
                  )

                  if (fila.nueva) {
                    return (
                      <RevelarEnScroll
                        key={fila.hora}
                        como="li"
                        recorrido="fundir"
                        retardo={1.1}
                        className="relative -mx-2 flex items-center gap-3 rounded-lg bg-primary/[0.07] px-2 py-3"
                      >
                        <span
                          className="absolute inset-y-2.5 left-0 w-0.5 rounded-full bg-primary"
                          aria-hidden
                        />
                        {contenido}
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <CalendarPlus className="size-3" aria-hidden />
                          {t("nueva")}
                        </span>
                      </RevelarEnScroll>
                    )
                  }

                  return (
                    <li
                      key={fila.hora}
                      className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-secondary"
                    >
                      {contenido}
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-(--exito)/10 px-2 py-0.5 text-[10px] font-medium text-(--exito)">
                        <Check className="size-3" aria-hidden />
                        {t("confirmada")}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* El aviso de la reserva que acaba de entrar. Cuelga por fuera del
            marco para leerse como algo que LLEGA al panel, no como parte de
            él. Repite la fila de abajo, así que es decorado para un lector de
            pantalla. Desde `sm`: en el teléfono taparía media agenda. */}
        <RevelarEnScroll
          retardo={0.6}
          className="absolute -bottom-10 -left-3 hidden w-64 sm:block lg:-left-8"
        >
          <div
            className="rounded-2xl border border-border bg-card p-3.5 shadow-[0_24px_48px_-24px_var(--sombra)]"
            aria-hidden
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CalendarPlus className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">{t("nuevaReserva")}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {t("desdeTuPagina", { cliente: reservaNueva.cliente })}
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-secondary px-2.5 py-2 text-[11px]">
              <span className="truncate font-medium">
                {servicio(reservaNueva.servicio)} · {reservaNueva.barbero}
              </span>
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {reservaNueva.hora}
              </span>
            </div>
          </div>
        </RevelarEnScroll>
      </div>

      {/* A la derecha desde `sm`, para no chocar con el aviso que cuelga a la
          izquierda por debajo del marco. */}
      <figcaption className="mt-4 text-sm text-muted-foreground sm:pl-64 sm:text-right">
        {pie("pieDelPanel")}
      </figcaption>
    </figure>
  )
}
