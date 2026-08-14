"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react"
import { ArrowRight, Menu, X } from "lucide-react"
import { LogoBarion } from "@/components/brand/LogoBarion"
import { SelectorIdioma } from "@/components/layout/SelectorIdioma"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Button } from "@/components/ui/button"
import { SECCIONES, rutas, rutasApp } from "@/config/rutas"
import { Link, usePathname } from "@/i18n/navigation"
import { CONTENEDOR } from "@/lib/superficies"
import { cn } from "@/lib/utils"

/**
 * Cabecera fija. Arriba del todo **en la portada** es transparente y pinta con
 * los tokens del hero —los que aguantan sobre la fotografía—; en cuanto hay
 * scroll, y en cualquier otra página, pasa a la superficie del tema.
 *
 * ── Lo que cambió, y por qué era un fallo ───────────────────────────────────
 * Las secciones eran ANCLAS (`#precios`) y el estado activo se calculaba con un
 * `IntersectionObserver` sobre elementos de la portada. Desde una página legal
 * —o desde cualquier otra que no fuera la portada— esos elementos no existían:
 * el observador no encontraba nada, ningún enlace se marcaba nunca, y pulsar
 * «Precios» no llevaba a ninguna parte porque el ancla no estaba en el
 * documento. La cabecera se veía completa y no funcionaba.
 *
 * Ahora cada sección es una página de verdad, así que el enlace es un enlace y
 * el activo lo dice `usePathname()`: funciona desde cualquier sitio, no depende
 * de que algo esté pintado, y de paso se prefetchea.
 *
 * La altura NO encoge al desplazarse: animar `height` provoca reflow en cada
 * fotograma y mueve todo lo de debajo. Lo que cambia es el fondo, el borde y la
 * escala del logotipo — transformaciones, que salen gratis.
 */
export function Nav() {
  const t = useTranslations("navegacion")
  const legal = useTranslations("pie")
  const [desplazada, setDesplazada] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const ruta = usePathname()

  const { scrollYProgress } = useScroll()
  const avance = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useEffect(() => {
    const alDesplazar = () => setDesplazada(window.scrollY > 16)
    alDesplazar()
    window.addEventListener("scroll", alDesplazar, { passive: true })
    return () => window.removeEventListener("scroll", alDesplazar)
  }, [])

  // La transparencia es del HERO, no de la cabecera: solo la portada lo tiene.
  // En el resto, una cabecera transparente dejaría texto claro sobre el fondo
  // del tema — ilegible en claro y casi invisible en oscuro.
  const enPortada = ruta === rutas.inicio
  const sobreElHero = enPortada && !desplazada && !menuAbierto

  const activa = (destino: string) => ruta === destino

  return (
    <>
      {/* Velo bajo el menú abierto. Sin él la lista flota sobre la página y el
          ojo sigue leyendo lo de detrás; con él, el menú es lo único que hay.
          Además es la salida grande: se pulsa fuera y se cierra.
          
          Va como HERMANO de la cabecera y no dentro: la cabecera crea contexto
          de apilamiento, así que un hijo suyo con z negativo se pintaría encima
          de su propio fondo — el velo acabaría tiñendo la barra. Fuera, con
          `z-40` contra el `z-50` de la cabecera, cubre la página y no la barra. */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25 }}
            onClick={() => setMenuAbierto(false)}
            className="fixed inset-0 z-40 cursor-default bg-foreground/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        // Entra deslizándose desde arriba: la cabecera es lo primero que se fija
        // y aparecer de golpe la hace sentir pegada, no colocada. Bajo el
        // `MotionConfig reducedMotion="user"` del layout, quien pide menos
        // movimiento la recibe ya puesta.
        initial={{ y: -96, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 210, damping: 26, delay: 0.05 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          sobreElHero
            ? "bg-transparent"
            : "border-b border-border bg-background/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
        )}
      >
        <div
          className={cn(
            CONTENEDOR,
            // `1fr auto 1fr`: las dos columnas laterales se reparten el sobrante a
            // partes iguales, así que la pastilla del centro cae en el centro de
            // la pantalla y no en el del hueco que quede. Con `mx-auto` en una
            // fila flexible se centraba respecto al espacio libre — y con el
            // logotipo a un lado y tres botones al otro, eso NO es el centro.
            "grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-24"
          )}
        >
          <Link
            href={rutas.inicio}
            aria-label={t("logotipo")}
            className="flex min-w-0 items-center justify-self-start transition-transform duration-300 motion-safe:hover:scale-[1.03]"
          >
            {/*
             * El logotipo medía `h-8`/`h-7` y en un portátil se leía como un
             * detalle, no como la marca: a 1280–1440 px la cabecera es ancha, el
             * logo se queda solo a la izquierda y ocho píxeles de alto no
             * sostienen esa distancia. Sube por tramos hasta `h-11`, que es lo que
             * lo equilibra con los botones de la derecha (`h-11`) sin engordar la
             * barra — la altura de la cabecera ya crece a `lg` para acompañarlo.
             */}
            <LogoBarion
              variante="completo"
              priority
              className={cn(
                "transition-all duration-300",
                sobreElHero ? "h-9 sm:h-10 lg:h-11" : "h-8 sm:h-9 lg:h-10"
              )}
            />
          </Link>

          {/* Las secciones van en su propia pastilla, centrada: separa NAVEGAR de
            ACTUAR, que es lo que hacen los dos botones de la derecha */}
          <nav
            className={cn(
              "hidden items-center gap-1 rounded-full border p-1 backdrop-blur-md transition-colors duration-300 lg:flex",
              "col-start-2 justify-self-center",
              sobreElHero
                ? "border-hero-borde bg-hero-superficie/40"
                : "border-border bg-secondary/60"
            )}
            aria-label={t("aria")}
          >
            {(["inicio", ...SECCIONES] as const).map((clave) => {
              const href = rutas[clave]
              const esActiva = activa(href)
              return (
                <Link
                  key={clave}
                  href={href}
                  aria-current={esActiva ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm font-medium xl:px-4",
                    "transition-[color,background-color] duration-200",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    sobreElHero
                      ? esActiva
                        ? "text-hero-foreground"
                        : "text-hero-muted hover:bg-hero-superficie/30 hover:text-hero-foreground"
                      : esActiva
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                  )}
                >
                  {/* UNA pastilla que se desplaza entre secciones (`layoutId`): el
                    movimiento cuenta de dónde vino, que es lo que un fundido
                    cruzado no dice */}
                  {esActiva && (
                    <motion.span
                      layoutId="pastilla-nav"
                      className={cn(
                        "absolute inset-0 -z-10 rounded-full",
                        sobreElHero
                          ? "bg-hero-superficie/70 ring-1 ring-hero-borde"
                          : "bg-card shadow-sm ring-1 ring-border/70"
                      )}
                      transition={{ type: "spring", stiffness: 340, damping: 32 }}
                    />
                  )}
                  {clave === "inicio" ? t("inicio") : t(`secciones.${clave}`)}
                </Link>
              )
            })}
          </nav>

          <div className="col-start-3 flex min-w-0 items-center gap-2 justify-self-end sm:gap-3">
            {/* Sobre el hero los dos controles se revisten con los tokens del
              hero: con los del tema quedarían pastillas opacas sobre la foto */}
            <div
              className={cn(
                "hidden items-center gap-2 sm:flex",
                // El recuadro reacciona al apuntar: un control que no se mueve
                // parece pintado.
                "[&_button]:transition-transform [&_button]:duration-200 motion-safe:[&_button:hover]:scale-105",
                sobreElHero &&
                  "[&_button]:border-hero-borde [&_button]:bg-hero-superficie/50 [&_button]:text-hero-foreground [&_button]:backdrop-blur-md"
              )}
            >
              <SelectorIdioma />
              <ThemeToggle />
            </div>

            <Button
              render={<a href={rutasApp.entrar} />}
              nativeButton={false}
              variant="ghost"
              size="lg"
              className={cn(
                "hidden h-11 lg:inline-flex",
                sobreElHero &&
                  "text-hero-foreground hover:bg-hero-superficie/60 hover:text-hero-foreground"
              )}
            >
              {t("entrar")}
            </Button>

            <Button
              render={<a href={rutasApp.registro} />}
              nativeButton={false}
              size="lg"
              className={cn(
                "group/cta h-11 rounded-xl px-5 font-semibold",
                // Sombra teñida de marca en vez de una gris: es el único elemento
                // de la barra que puede permitírsela, y es lo que lo separa del
                // resto sin subirle el tamaño.
                "shadow-lg shadow-primary/20 transition-[transform,box-shadow] duration-200",
                "hover:shadow-xl hover:shadow-primary/30 motion-safe:hover:-translate-y-0.5",
                sobreElHero &&
                  "bg-hero-primary text-hero-primary-foreground shadow-hero-primary/25 hover:bg-hero-primary/85 hover:shadow-hero-primary/40 focus-visible:ring-hero-primary/40"
              )}
            >
              {t("empezar")}
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
              aria-label={menuAbierto ? t("cerrarMenu") : t("abrirMenu")}
              aria-expanded={menuAbierto}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
            >
              {/* El icono gira al cambiar en vez de sustituirse de golpe: el giro
                dice que es el MISMO control en otro estado, que es justo lo que
                un cambio instantáneo no cuenta. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuAbierto ? "cerrar" : "abrir"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="flex"
                >
                  {menuAbierto ? <X aria-hidden /> : <Menu aria-hidden />}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Cuánto queda de página. Escala horizontal, nunca un ancho que reflowe.
          Dos píxeles y no uno: a uno solo no se ve sobre el borde de la
          cabecera, que mide lo mismo. */}
        <motion.div
          className="h-0.5 origin-left bg-gradient-to-r from-primary/70 to-primary"
          style={{ scaleX: avance, opacity: desplazada ? 1 : 0 }}
          transition={{ duration: 0.2 }}
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
              aria-label={t("aria")}
            >
              <motion.ul
                className="flex flex-col"
                initial="oculto"
                animate="visible"
                transition={{ delayChildren: 0.05, staggerChildren: 0.04 }}
              >
                {/* «Inicio» solo en el menú móvil: en escritorio esa vuelta la
                  hace el logotipo, que está siempre visible. Aquí el logotipo
                  también está, pero con el menú abierto lo tapa la lista — y
                  quien viene de una sección busca la portada en la lista, no en
                  la esquina. */}
                <motion.li
                  variants={{ oculto: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                >
                  <Link
                    href={rutas.inicio}
                    onClick={() => setMenuAbierto(false)}
                    aria-current={activa(rutas.inicio) ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center justify-between border-b border-border pb-2 text-base font-medium transition-colors",
                      activa(rutas.inicio) ? "text-primary" : "text-foreground"
                    )}
                  >
                    {t("inicio")}
                    <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                  </Link>
                </motion.li>

                {SECCIONES.map((clave) => (
                  <motion.li
                    key={clave}
                    variants={{ oculto: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      href={rutas[clave]}
                      // Se cierra al pulsar y no con un efecto sobre la ruta: un
                      // `setState` dentro de un efecto es un render de más, y aquí
                      // además el cierre es la consecuencia directa del clic.
                      onClick={() => setMenuAbierto(false)}
                      aria-current={activa(rutas[clave]) ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center justify-between text-base font-medium transition-colors",
                        activa(rutas[clave]) ? "text-primary" : "text-foreground"
                      )}
                    >
                      {t(`secciones.${clave}`)}
                      <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Lo legal también en el menú móvil: es la única forma de cruzar
                entre documentos sin recorrer uno entero hasta el pie, y desde
                una página legal el menú es la única navegación a mano. */}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4">
                {(["terminos", "privacidad", "cookies"] as const).map((documento) => (
                  <Link
                    key={documento}
                    href={rutas[documento]}
                    onClick={() => setMenuAbierto(false)}
                    aria-current={activa(rutas[documento]) ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center text-sm transition-colors",
                      activa(rutas[documento]) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {legal(documento)}
                  </Link>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-2 border-t border-border pt-4">
                <SelectorIdioma />
                <ThemeToggle />
                <a
                  href={rutasApp.entrar}
                  onClick={() => setMenuAbierto(false)}
                  className="ml-auto flex min-h-11 items-center text-sm font-medium text-muted-foreground"
                >
                  {t("entrar")}
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
