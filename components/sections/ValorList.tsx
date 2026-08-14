"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Check } from "lucide-react"
import { EncabezadoSeccion } from "@/components/sections/EncabezadoSeccion"
import { Seccion } from "@/components/sections/Seccion"
import { CLAVES_BLOQUE, CLAVES_CAPACIDAD, iconosBloque, iconosCapacidad } from "@/config/contenido"
import { TARJETA, TARJETA_AIRE, TARJETA_VIVA } from "@/lib/superficies"
import { cn } from "@/lib/utils"

interface ValorListProps {
  nivel?: "h1" | "h2"
  /**
   * En la portada se recorta, pero **NO la prueba**.
   *
   * Los tres bloques van enteros —con lo que hace cada uno exactamente—, porque
   * eso es lo que convence y la portada tiene que vender sola: obligar a un clic
   * para leer lo concreto es meter un paso entre alguien interesado y la compra.
   * Lo que se guarda para `/producto` son las siete capacidades extra, que son
   * el detalle de segundo orden.
   */
  resumen?: boolean
  enlace?: { href: string; texto: string }
  tono?: "base" | "alterno"
  separador?: boolean
}

/**
 * Los tres bloques de valor. Entran en cascada al aparecer, una sola vez, y
 * desde ahí responden al puntero: una tarjeta que no reacciona parece una imagen.
 */
export function ValorList({
  nivel = "h2",
  resumen = false,
  enlace,
  tono = "base",
  separador = true,
}: ValorListProps) {
  const t = useTranslations("producto")
  return (
    <Seccion tono={tono} separador={separador}>
      <EncabezadoSeccion
        etiqueta={t("etiqueta")}
        titulo={t("titulo")}
        entrada={t("entrada")}
        nivel={nivel}
        enlace={enlace}
      />

      <motion.ul
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.06 }}
        className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {CLAVES_BLOQUE.map((clave, indice) => {
          const Icono = iconosBloque[clave]
          // `raw` porque `detalles` es una lista, no una frase: `t()` devuelve
          // texto ya formateado y aquí hace falta el array tal cual.
          const detalles = t.raw(`bloques.${clave}.detalles`) as string[]

          return (
            <motion.li
              key={clave}
              variants={{ oculto: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              className={cn(
                "group relative flex flex-col overflow-hidden",
                TARJETA,
                TARJETA_AIRE,
                TARJETA_VIVA
              )}
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

              <h3 className="mt-6 text-xl font-semibold tracking-tight text-balance">
                {t(`bloques.${clave}.titulo`)}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {t(`bloques.${clave}.descripcion`)}
              </p>

              {/* También en la portada: es lo concreto, y lo concreto es lo
                  que convence. Esconderlo tras un clic mete un paso entre
                  alguien interesado y la compra. */}
              <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
                {detalles.map((detalle) => (
                  <li key={detalle} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-muted-foreground">{detalle}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          )
        })}
      </motion.ul>

      {/* Lo que no cabe en tres bloques pero decide una compra */}
      {!resumen && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8"
        >
          <span className="text-sm font-medium text-foreground">{t("ademas")}</span>
          {CLAVES_CAPACIDAD.map((clave) => {
            const Icono = iconosCapacidad[clave]
            return (
              <span
                key={clave}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Icono className="size-3.5 text-primary" aria-hidden />
                {t(`capacidades.${clave}`)}
              </span>
            )
          })}
        </motion.div>
      )}
    </Seccion>
  )
}
