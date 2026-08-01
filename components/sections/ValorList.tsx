"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"
import { bloquesValor, capacidadesExtra } from "@/constants/valor"

// Tres bloques de valor, cada uno con lo que hace de verdad. Entran en cascada
// al aparecer, una sola vez, y desde ahí responden al puntero: una tarjeta que
// no reacciona parece una imagen.
export function ValorList() {
  return (
    <section
      id="producto"
      className="flex min-h-dvh scroll-mt-20 flex-col justify-center border-b border-border bg-background py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Lo que cambia el lunes
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Tres cosas que dejas de hacer a mano
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            No es un calendario con otro nombre. Es la agenda, la ficha de cada cliente y la cuenta
            de cada barbero funcionando sobre los mismos datos, sin que nadie los copie de un sitio
            a otro.
          </p>
        </div>

        <motion.ul
          initial="oculto"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.06 }}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {bloquesValor.map(({ icono: Icono, titulo, descripcion, detalles }, indice) => (
            <motion.li
              key={titulo}
              variants={{ oculto: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition-[border-color,box-shadow,transform] duration-300 hover:border-primary/40 hover:shadow-lg motion-safe:hover:-translate-y-1"
            >
              {/* Resplandor que entra desde la esquina al apuntar. Opacidad, no
                  un fondo que repinte la tarjeta entera */}
              <span
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />

              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 motion-safe:group-hover:scale-110">
                  <Icono className="size-5" aria-hidden />
                </span>
                {/* Numeración editorial: da orden de lectura sin más palabras */}
                <span className="text-sm font-semibold text-muted-foreground tabular-nums transition-colors duration-300 group-hover:text-primary">
                  {String(indice + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight">{titulo}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{descripcion}</p>

              <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
                {detalles.map((detalle) => (
                  <li key={detalle} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-muted-foreground">{detalle}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>

        {/* Lo que no cabe en tres bloques pero decide una compra */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8"
        >
          <span className="text-sm font-medium text-foreground">Y además:</span>
          {capacidadesExtra.map(({ icono: Icono, texto }) => (
            <span
              key={texto}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Icono className="size-3.5 text-primary" aria-hidden />
              {texto}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
