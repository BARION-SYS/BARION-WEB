"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform, type Variants } from "motion/react"
import { ArrowRight, ChevronDown, Globe, Smartphone, Sparkles, Timer } from "lucide-react"
import { regiones, type CodigoRegion } from "@/config/regiones"
import { HeroPanel } from "@/components/sections/HeroPanel"
import { anclas, rutasApp } from "@/config/rutas"
import { Button } from "@/components/ui/button"
import { useMontado } from "@/hooks/useMontado"

interface LandingHeroProps {
  region: CodigoRegion
}

// Hechos comprobables hoy. Nada de «+500 barberías» ni estrellas: no hay
// clientes todavía y una prueba social inventada se nota y se paga.
const senales = [
  { icono: Timer, texto: "Listo en una tarde" },
  { icono: Globe, texto: "Colombia · EE. UU. · España" },
  { icono: Smartphone, texto: "Sin instalar nada" },
]

const resorte = { type: "spring", stiffness: 140, damping: 22 } as const

const entrada: Variants = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: resorte },
}

// El titular entra palabra a palabra. Es la única cascada larga de la página, y
// va aquí porque es lo primero que se lee: en el resto sería ruido.
const palabra: Variants = {
  oculto: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 20 } },
}

const primeraLinea = "Administra tu barbería."
const segundaLinea = "Eleva tu legado."

// La misma sala en sus dos luces. No es la misma foto aclarada: en claro es un
// local blanco con oro y en oscuro uno nocturno, y cada una es la que sostiene
// el contraste de su tema.
const fotografias = {
  claro: "/assets/barion-hero-light.webp",
  oscuro: "/assets/barion-hero-dark.webp",
} as const

export function Hero({ region }: LandingHeroProps) {
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
        className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-14"
      >
        <motion.div
          initial="oculto"
          animate="visible"
          transition={{ staggerChildren: 0.05 }}
          className="lg:col-span-5"
        >
          <motion.p
            variants={entrada}
            className="inline-flex items-center gap-2 rounded-full border border-hero-borde bg-hero-superficie/60 px-4 py-2 text-xs font-medium tracking-widest text-hero-primary uppercase backdrop-blur-md"
          >
            <Sparkles className="size-3.5" aria-hidden />
            Software premium para barberías
          </motion.p>

          <h1 className="mt-8 text-5xl leading-[0.95] font-black tracking-tight text-balance sm:text-6xl xl:text-7xl">
            <motion.span
              className="block"
              initial="oculto"
              animate="visible"
              transition={{ delayChildren: 0.15, staggerChildren: 0.055 }}
            >
              {primeraLinea.split(" ").map((texto) => (
                <motion.span key={texto} variants={palabra} className="mr-[0.25em] inline-block">
                  {texto}
                </motion.span>
              ))}
            </motion.span>
            <motion.span
              className="block text-hero-primary"
              initial="oculto"
              animate="visible"
              transition={{ delayChildren: 0.35, staggerChildren: 0.055 }}
            >
              {segundaLinea.split(" ").map((texto) => (
                <motion.span key={texto} variants={palabra} className="mr-[0.25em] inline-block">
                  {texto}
                </motion.span>
              ))}
            </motion.span>
          </h1>

          <motion.div
            initial="oculto"
            animate="visible"
            transition={{ delayChildren: 0.55, staggerChildren: 0.06 }}
          >
            <motion.p
              variants={entrada}
              className="mt-7 max-w-lg text-base leading-relaxed text-hero-muted sm:text-lg"
            >
              Agenda, clientes y nómina en un solo sitio. Tus clientes reservan solos desde el móvil
              y tú ves el negocio entero desde una pantalla.
            </motion.p>

            <motion.div variants={entrada} className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button
                render={<a href={rutasApp.registro} />}
                nativeButton={false}
                className="group/cta h-14 rounded-2xl bg-hero-primary px-7 text-base font-semibold text-hero-primary-foreground shadow-lg transition-transform hover:bg-hero-primary/85 focus-visible:ring-hero-primary/40 motion-safe:hover:-translate-y-0.5"
              >
                Empezar la prueba
                <ArrowRight
                  className="transition-transform duration-200 group-hover/cta:translate-x-1"
                  aria-hidden
                />
              </Button>
              <Button
                render={<Link href={anclas.precios} />}
                nativeButton={false}
                variant="ghost"
                className="h-14 rounded-2xl border border-hero-borde bg-hero-superficie/50 px-7 text-base font-semibold text-hero-foreground backdrop-blur-md transition-transform hover:bg-hero-superficie/80 hover:text-hero-foreground focus-visible:ring-hero-primary/40 motion-safe:hover:-translate-y-0.5"
              >
                Ver los planes
              </Button>
            </motion.div>

            <motion.p variants={entrada} className="mt-4 text-sm text-hero-muted">
              15 días de prueba · Sin tarjeta
            </motion.p>

            <motion.ul
              variants={entrada}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {senales.map(({ icono: Icono, texto }) => (
                <li key={texto} className="flex items-center gap-2 text-xs text-hero-muted">
                  <Icono className="size-4 text-hero-primary" aria-hidden />
                  {texto}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

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
          Desliza
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.div>

      {/* Acento de marca. UNA vez en toda la página */}
      <div className="cinta-barberia absolute inset-x-0 bottom-0 h-1.5" aria-hidden />
    </section>
  )
}
