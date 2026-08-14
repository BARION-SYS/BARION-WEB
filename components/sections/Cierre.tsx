import { ArrowRight, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import { Seccion } from "@/components/sections/Seccion"
import { Button } from "@/components/ui/button"
import { CLAVES_ARRANQUE, CLAVES_GARANTIA, iconosArranque } from "@/config/contenido"
import { rutas, rutasApp } from "@/config/rutas"
import { Link } from "@/i18n/navigation"
import { PASO } from "@/lib/superficies"

interface CierreProps {
  tono?: "base" | "alterno"
  /**
   * Apagado por defecto: el cierre es SIEMPRE la última sección de su página, y
   * el pie ya trae su propio borde superior. Dos pegados se ven como una raya
   * gruesa y torcida.
   */
  separador?: boolean
}

/**
 * El cierre: la última oportunidad de la página.
 *
 * ── Qué se rehízo, y por qué lo anterior no funcionaba ──────────────────────
 * Era una tarjeta centrada con TODO dentro: titular, párrafo, tres tarjetas de
 * paso en fila, dos botones y una línea de letra pequeña — todo centrado y todo
 * al mismo peso. Centrarlo todo no es jerarquía: es renunciar a ella. El ojo no
 * tenía por dónde entrar y los tres pasos, al ser tarjetas, competían con el
 * botón que de verdad importa.
 *
 * Ahora es **asimétrico y con una sola acción primaria**:
 *
 *  · **Izquierda (7/12)** — el argumento y la acción: rótulo, titular, frase,
 *    botón, y debajo lo que quita el miedo (prueba sin tarjeta y las garantías
 *    de cualquier plan). Es la columna que se lee primero en occidente.
 *  · **Derecha (5/12)** — qué pasa DESPUÉS de pulsar, como lista numerada y no
 *    como tarjetas. Es prueba, no llamada: responde «¿cuánto me va a costar
 *    montarlo?», que es lo que frena en el último paso, sin pedir un clic.
 *
 * El enlace a los planes deja de ser un botón con borde y pasa a ser texto: dos
 * botones del mismo tamaño son dos acciones primarias, o sea ninguna.
 */
export function Cierre({ tono = "alterno", separador = false }: CierreProps = {}) {
  const t = useTranslations("cierre")
  const precios = useTranslations("precios")

  return (
    <Seccion tono={tono} separador={separador}>
      <RevelarEnScroll
        recorrido="zoom"
        className="relative isolate overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 sm:px-10 lg:px-14 lg:py-20"
      >
        {/* Dos resplandores del oro de marca: dan cuerpo al cierre sin meter
            otra imagen ni otro color al sistema */}
        <span
          className="pointer-events-none absolute -top-24 -left-16 -z-10 size-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-16 -bottom-28 -z-10 size-72 rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── El argumento y la acción ──────────────────────────────── */}
          <div className="lg:col-span-7">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {t("titulo")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {t("entrada")}
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button
                render={<a href={rutasApp.registro} />}
                nativeButton={false}
                size="lg"
                className="group/cta h-13 rounded-xl px-8 text-base font-semibold shadow-lg transition-transform motion-safe:hover:-translate-y-0.5"
              >
                {t("ctaPrimario")}
                <ArrowRight
                  className="transition-transform duration-200 group-hover/cta:translate-x-1"
                  aria-hidden
                />
              </Button>

              {/* Texto y no un segundo botón: es la alternativa, no una acción
                  del mismo rango. */}
              <Link
                href={rutas.precios}
                className="group inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {t("ctaSecundario")}
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{t("prueba")}</p>

            {/* Lo que quita el miedo justo donde se decide. Estaba solo en la
                página de precios, que es un clic más en el peor momento. */}
            <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2 border-t border-border pt-6 sm:grid-cols-2">
              {CLAVES_GARANTIA.map((clave) => (
                <li key={clave} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {precios(`garantias.${clave}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Qué pasa después de pulsar ────────────────────────────── */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              {t("comoEmpieza")}
            </p>

            <ol className="mt-5 space-y-6">
              {CLAVES_ARRANQUE.map((clave, indice) => {
                const Icono = iconosArranque[clave]
                return (
                  <li key={clave} className="relative flex gap-4">
                    {/* El hilo que une los pasos: la secuencia se ve, no se
                        deduce. No lo lleva el último. */}
                    {indice < CLAVES_ARRANQUE.length - 1 && (
                      <span
                        className="absolute top-11 left-[1.125rem] h-[calc(100%-0.5rem)] w-px bg-border"
                        aria-hidden
                      />
                    )}
                    <span className={PASO} aria-hidden>
                      {String(indice + 1).padStart(2, "0")}
                    </span>
                    <span className="sr-only">{t("paso", { numero: indice + 1 })}</span>
                    <div className="min-w-0 flex-1 pb-1">
                      <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                        <Icono className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        {t(`arranque.${clave}.titulo`)}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {t(`arranque.${clave}.descripcion`)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </RevelarEnScroll>
    </Seccion>
  )
}
