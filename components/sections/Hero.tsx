"use client"

import { useRef } from "react"
import { CLAVES_SENAL } from "@/config/contenido"
import { CONTENEDOR } from "@/lib/superficies"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowRight, ChevronDown, Globe, Smartphone, Sparkles, Timer } from "lucide-react"
import { regiones, type CodigoRegion } from "@/config/regiones"
import { HeroPanel } from "@/components/sections/HeroPanel"
import { rutas, rutasApp } from "@/config/rutas"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { useMontado } from "@/hooks/useMontado"

interface LandingHeroProps {
  region: CodigoRegion
}

// Hechos comprobables hoy. Nada de «+500 barberías» ni estrellas: no hay
// clientes todavía y una prueba social inventada se nota y se paga.
const iconosSenal = { rapido: Timer, mercados: Globe, sinInstalar: Smartphone } as const

/**
 * La entrada del hero se hace con CSS, y es el cambio más caro de deshacer.
 *
 * ── Qué estaba pasando ──────────────────────────────────────────────────────
 * Todo este bloque entraba con `variants` de Motion, así que el HTML del
 * servidor lo traía en `opacity: 0` y no llegaba a su forma final hasta que el
 * JavaScript bajaba, se ejecutaba e hidrataba. El navegador no cuenta como
 * «pintado» lo que todavía es invisible: el LCP medido era el párrafo de
 * entrada, con **3.170 ms de retraso de renderizado** sobre 530 ms de servidor.
 * Un párrafo de texto plano que ya venía escrito en el HTML.
 *
 * ── Por qué CSS lo arregla ──────────────────────────────────────────────────
 * Una animación CSS arranca en el primer fotograma, sin esperar a hidratar: el
 * texto se ve cuando llega el HTML, no cuando llega el bundle. El movimiento es
 * el mismo; lo que cambia es de quién depende.
 *
 * ── La regla que queda ──────────────────────────────────────────────────────
 * **Lo que se ve sin desplazar la página no arranca en `opacity: 0` por obra de
 * un componente cliente.** Motion sigue aquí para el parallax y la pista de
 * scroll, que solo actúan al desplazar y no deciden el LCP.
 *
 * Los retardos son CORTOS a propósito: mientras el elemento está transparente
 * sigue sin contar como pintado, así que la cascada entera cabe en medio
 * segundo. Es la diferencia entre un adorno y un elemento que pesa en la
 * métrica con la que Google ordena.
 */
const RETARDO_TITULAR = 60
const PASO_PALABRA = 40
const RETARDO_ENTRADA = 300

/** El retardo de un elemento, como variable CSS — nunca un `style` de animación. */
const conRetardo = (ms: number) => ({ "--retardo": `${ms}ms` }) as React.CSSProperties

// La misma sala en sus dos luces. No es la misma foto aclarada: en claro es un
// local blanco con oro y en oscuro uno nocturno, y cada una es la que sostiene
// el contraste de su tema.
const fotografias = {
  claro: "/assets/barion-hero-light.webp",
  oscuro: "/assets/barion-hero-dark.webp",
} as const

/**
 * Una línea del titular, palabra a palabra.
 *
 * Cada palabra es su propio `inline-block` porque lo que se anima es un
 * `transform`, y un `<span>` en línea no lo acepta. El texto sigue siendo UNO
 * para quien lo lee con un lector de pantalla y para «buscar en la página»: son
 * espacios de verdad entre palabras de verdad, no elementos vacíos.
 */
function Palabras({
  texto,
  desde,
  className,
}: {
  texto: string
  desde: number
  className?: string
}) {
  return (
    <span className={cn("block", className)}>
      {texto.split(" ").map((palabra, indice) => (
        <span
          key={palabra}
          className="entra-hero mr-[0.25em] inline-block"
          style={conRetardo(desde + indice * PASO_PALABRA)}
        >
          {palabra}
        </span>
      ))}
    </span>
  )
}

export function Hero({ region }: LandingHeroProps) {
  const t = useTranslations("hero")
  const { moneda, locale } = regiones[region]
  const seccion = useRef<HTMLElement>(null)

  // El tema solo se conoce en el cliente: en el servidor no hay `localStorage`
  // ni preferencia de sistema. Hasta montar se pinta la nocturna, que es el tema
  // por defecto — el mismo guard de `LogoBarion`.
  const { resolvedTheme } = useTheme()
  const montado = useMontado()
  const fotografia = montado && resolvedTheme === "light" ? fotografias.claro : fotografias.oscuro

  // Progreso del hero saliendo de pantalla: de él cuelgan la profundidad de la
  // fotografía, la despedida del contenido y el enderezado del panel. Un solo
  // origen para todo el movimiento de salida — así nada se desincroniza.
  const { scrollYProgress } = useScroll({
    target: seccion,
    offset: ["start start", "end start"],
  })

  // La foto se mueve MENOS que el texto: es lo que da la sensación de fondo.
  const yFoto = useTransform(scrollYProgress, [0, 1], ["0%", "14%"])
  const escalaFoto = useTransform(scrollYProgress, [0, 1], [1.06, 1.16])
  const yContenido = useTransform(scrollYProgress, [0, 1], [0, -70])
  const opacidadContenido = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const opacidadPista = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <section
      ref={seccion}
      className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden bg-hero pt-28 pb-20 text-hero-foreground sm:pt-32 lg:pb-28"
    >
      {/* Escala de sobra para que el parallax no descubra el borde en ningún
          ancho. Sin desenfoque: la sala es la mitad del argumento de venta */}
      <motion.div className="absolute inset-0" style={{ y: yFoto, scale: escalaFoto }} aria-hidden>
        <Image
          key={fotografia}
          src={fotografia}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Un solo velo, por la izquierda, y su intensidad vive en globals.css
          (cambia por tema). A la derecha la sala se ve tal cual */}
      <div className="velo-hero-lateral absolute inset-0" aria-hidden />
      {/* Costura con la sección siguiente, en el tema que sea */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background"
        aria-hidden
      />

      <motion.div
        style={{ y: yContenido, opacity: opacidadContenido }}
        className={cn(
          CONTENEDOR,
          "relative grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-8"
        )}
      >
        <div className="lg:col-span-5">
          <p
            className="entra-hero inline-flex items-center gap-2 rounded-full border border-hero-borde bg-hero-superficie/60 px-4 py-2 text-xs font-medium tracking-widest text-hero-primary uppercase backdrop-blur-md"
            style={conRetardo(0)}
          >
            <Sparkles className="size-3.5" aria-hidden />
            {t("insignia")}
          </p>

          {/* El titular entra palabra a palabra. Es la única cascada larga de la
              página, y va aquí porque es lo primero que se lee: en el resto
              sería ruido. */}
          <h1 className="mt-8 text-5xl leading-[0.95] font-black tracking-tight text-balance sm:text-6xl xl:text-7xl">
            <Palabras texto={t("titularUno")} desde={RETARDO_TITULAR} />
            <Palabras
              texto={t("titularDos")}
              desde={RETARDO_TITULAR + PASO_PALABRA * 3}
              className="text-hero-primary"
            />
          </h1>

          <p
            className="entra-hero mt-7 max-w-lg text-base leading-relaxed text-hero-muted sm:text-lg"
            style={conRetardo(RETARDO_ENTRADA)}
          >
            {t("entrada")}
          </p>

          <div
            className="entra-hero mt-9 flex flex-col gap-4 sm:flex-row"
            style={conRetardo(RETARDO_ENTRADA + 60)}
          >
            <Button
              render={<a href={rutasApp.registro} />}
              nativeButton={false}
              className="group/cta h-14 rounded-2xl bg-hero-primary px-7 text-base font-semibold text-hero-primary-foreground shadow-lg transition-transform hover:bg-hero-primary/85 focus-visible:ring-hero-primary/40 motion-safe:hover:-translate-y-0.5"
            >
              {t("ctaPrimario")}
              <ArrowRight
                className="transition-transform duration-200 group-hover/cta:translate-x-1"
                aria-hidden
              />
            </Button>
            <Button
              render={<Link href={rutas.precios} />}
              nativeButton={false}
              variant="ghost"
              className="h-14 rounded-2xl border border-hero-borde bg-hero-superficie/50 px-7 text-base font-semibold text-hero-foreground backdrop-blur-md transition-transform hover:bg-hero-superficie/80 hover:text-hero-foreground focus-visible:ring-hero-primary/40 motion-safe:hover:-translate-y-0.5"
            >
              {t("ctaSecundario")}
            </Button>
          </div>

          <p
            className="entra-hero mt-4 text-sm text-hero-muted"
            style={conRetardo(RETARDO_ENTRADA + 120)}
          >
            {t("prueba")}
          </p>

          <ul
            className="entra-hero mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={conRetardo(RETARDO_ENTRADA + 180)}
          >
            {CLAVES_SENAL.map((clave) => {
              const Icono = iconosSenal[clave]
              return (
                <li key={clave} className="flex items-center gap-2 text-xs text-hero-muted">
                  <Icono className="size-4 text-hero-primary" aria-hidden />
                  {t(`senales.${clave}`)}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Siete columnas y sangrado a la derecha: además de dar aire al panel,
            tapa el rótulo de la barbería que la fotografía trae al fondo — dos
            marcas compitiendo en el mismo sitio se leen como un error */}
        <div className="lg:col-span-7 lg:col-start-6 xl:-mr-10">
          <HeroPanel moneda={moneda} locale={locale} progreso={scrollYProgress} />
        </div>
      </motion.div>

      {/* Pista de scroll: se desvanece en cuanto la persona empieza a bajar */}
      <motion.div
        style={{ opacity: opacidadPista }}
        className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center lg:flex"
        aria-hidden
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-[10px] font-medium tracking-widest text-hero-muted uppercase"
        >
          {t("desliza")}
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.div>

      {/* Acento de marca. UNA vez en toda la página */}
      <div className="cinta-barberia absolute inset-x-0 bottom-0 h-1.5" aria-hidden />
    </section>
  )
}
