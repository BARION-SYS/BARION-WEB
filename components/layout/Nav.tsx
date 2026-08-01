"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react"
import { ArrowRight, Menu, X } from "lucide-react"
import { LogoBarion } from "@/components/brand/LogoBarion"
import { rutas, rutasApp } from "@/config/rutas"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { cn } from "@/lib/utils"

const enlaces = [
  { id: "producto", texto: "Producto" },
  { id: "vista-previa", texto: "Cómo se ve" },
  { id: "precios", texto: "Precios" },
  { id: "preguntas", texto: "Preguntas" },
]

/**
 * Cabecera fija sobre el hero. Arriba del todo es transparente y pinta con los
 * tokens del hero —los que aguantan sobre la fotografía—; en cuanto hay scroll
 * pasa a la superficie del tema. Es fija y no sticky a propósito: el hero ocupa
 * la pantalla entera y empieza en el borde superior, así que su altura se
 * reserva con el `pt` del hero.
 *
 * La altura NO encoge al desplazarse: animar `height` provoca reflow en cada
 * fotograma y mueve todo lo de debajo. Lo que cambia es el fondo, el borde y la
 * escala del logotipo — transformaciones, que salen gratis.
 */
export function Nav() {
  const [desplazada, setDesplazada] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState("")

  const { scrollYProgress } = useScroll()
  const avance = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    const alDesplazar = () => setDesplazada(window.scrollY > 16)
    alDesplazar()
    window.addEventListener("scroll", alDesplazar, { passive: true })
    return () => window.removeEventListener("scroll", alDesplazar)
  }, [])

  // Dónde está la persona. Con un observador y no midiendo posiciones en cada
  // scroll: el navegador ya sabe qué hay en pantalla y avisa solo. La franja
  // central (45 % arriba y abajo) hace que una sección se marque cuando ocupa el
  // centro de la vista, no cuando asoma por el borde.
  useEffect(() => {
    const secciones = enlaces
      .map((enlace) => document.getElementById(enlace.id))
      .filter((seccion): seccion is HTMLElement => seccion !== null)
    if (secciones.length === 0) return

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((entrada) => entrada.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setSeccionActiva(visible.target.id)
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    )
    secciones.forEach((seccion) => observador.observe(seccion))
    return () => observador.disconnect()
  }, [])

  const sobreElHero = !desplazada && !menuAbierto

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        sobreElHero
          ? "bg-transparent"
          : "border-b border-border bg-background/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1500px] items-center gap-4 px-6 sm:px-8 lg:px-14">
        <Link
          href={rutas.inicio}
          aria-label="Barion — inicio"
          className="flex items-center transition-transform duration-300 motion-safe:hover:scale-[1.03]"
        >
          <LogoBarion
            variante="completo"
            priority
            className={cn("transition-all duration-300", sobreElHero ? "h-8" : "h-7")}
          />
        </Link>

        {/* Las secciones van en su propia pastilla, centrada: separa NAVEGAR de
            ACTUAR, que es lo que hacen los dos botones de la derecha */}
        <nav
          className={cn(
            "absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border p-1 backdrop-blur-md transition-colors duration-300 lg:flex",
            sobreElHero
              ? "border-hero-borde bg-hero-superficie/40"
              : "border-border bg-secondary/60"
          )}
          aria-label="Secciones"
        >
          {enlaces.map((enlace) => {
            const activa = seccionActiva === enlace.id
            return (
              <Link
                key={enlace.id}
                href={`#${enlace.id}`}
                aria-current={activa ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  sobreElHero
                    ? activa
                      ? "text-hero-foreground"
                      : "text-hero-muted hover:text-hero-foreground"
                    : activa
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* UNA pastilla que se desplaza entre secciones (`layoutId`): el
                    movimiento cuenta de dónde vino, que es lo que un fundido
                    cruzado no dice */}
                {activa && (
                  <motion.span
                    layoutId="pastilla-nav"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      sobreElHero ? "bg-hero-superficie/70" : "bg-card shadow-sm"
                    )}
                    transition={{ type: "spring", stiffness: 340, damping: 32 }}
                  />
                )}
                {enlace.texto}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Sobre el hero el control de tema se reviste con los tokens del
              hero: con los del tema quedaría una pastilla opaca sobre la foto */}
          <div
            className={cn(
              sobreElHero &&
                "hidden sm:block [&_button]:border-hero-borde [&_button]:bg-hero-superficie/50 [&_button]:text-hero-foreground [&_button]:backdrop-blur-md"
            )}
          >
            <ThemeToggle />
          </div>

          <Button
            render={<a href={rutasApp.entrar} />}
            nativeButton={false}
            variant="ghost"
            size="lg"
            className={cn(
              "hidden h-11 sm:inline-flex",
              sobreElHero &&
                "text-hero-foreground hover:bg-hero-superficie/60 hover:text-hero-foreground"
            )}
          >
            Iniciar sesión
          </Button>

          <Button
            render={<a href={rutasApp.registro} />}
            nativeButton={false}
            size="lg"
            className={cn(
              "group/cta h-11 rounded-xl px-5 font-semibold transition-transform motion-safe:hover:-translate-y-0.5",
              sobreElHero &&
                "bg-hero-primary text-hero-primary-foreground hover:bg-hero-primary/85 focus-visible:ring-hero-primary/40"
            )}
          >
            Empezar la prueba
            <ArrowRight
              className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
              aria-hidden
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-11 lg:hidden",
              sobreElHero && "text-hero-foreground hover:bg-hero-superficie/60"
            )}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            {menuAbierto ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </div>

      {/* Cuánto queda de página. Escala horizontal, nunca un ancho que reflowe */}
      <motion.div
        className="h-px origin-left bg-primary"
        style={{ scaleX: avance, opacity: desplazada ? 1 : 0 }}
        aria-hidden
      />

      <AnimatePresence>
        {menuAbierto && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="border-t border-border bg-background px-6 pt-2 pb-6 lg:hidden"
            aria-label="Secciones"
          >
            <motion.ul
              className="flex flex-col"
              initial="oculto"
              animate="visible"
              transition={{ delayChildren: 0.05, staggerChildren: 0.04 }}
            >
              {enlaces.map((enlace) => (
                <motion.li
                  key={enlace.id}
                  variants={{ oculto: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                >
                  <Link
                    href={`#${enlace.id}`}
                    onClick={() => setMenuAbierto(false)}
                    className={cn(
                      "flex min-h-12 items-center justify-between text-base font-medium transition-colors",
                      seccionActiva === enlace.id ? "text-primary" : "text-foreground"
                    )}
                  >
                    {enlace.texto}
                    <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
              <ThemeToggle />
              <a
                href={rutasApp.entrar}
                onClick={() => setMenuAbierto(false)}
                className="ml-auto flex min-h-11 items-center text-sm font-medium text-muted-foreground"
              >
                Iniciar sesión
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
