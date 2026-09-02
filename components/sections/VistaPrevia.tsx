import { useTranslations } from "next-intl"
import { CalendarDays, Check, Users } from "lucide-react"
import { RevelarEnScroll } from "@/components/common/RevelarEnScroll"
import { EncabezadoSeccion } from "@/components/sections/EncabezadoSeccion"
import { EscaparateDemo } from "@/components/sections/EscaparateDemo"
import { Seccion } from "@/components/sections/Seccion"
import { CLAVES_PASO } from "@/config/contenido"
import { PASO, TARJETA, TARJETA_AIRE, TARJETA_VIVA } from "@/lib/superficies"
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
  /** En la portada, solo los tres pasos y el panel. El escaparate jugable vive en su página. */
  resumen?: boolean
  enlace?: { href: string; texto: string }
  tono?: "base" | "alterno"
  separador?: boolean
}

/**
 * El panel y el escaparate, dibujados con componentes.
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
  return (
    <Seccion tono={tono} separador={separador}>
      <EncabezadoSeccion
        etiqueta={t("etiqueta")}
        titulo={t("titulo")}
        entrada={t("entrada")}
        nivel={nivel}
        enlace={enlace}
      />

      <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* El envoltorio de la animación ES el `<li>`, no un `<div>` metido
            entre la lista y sus elementos: eso dejaba la `<ol>` con hijos que no
            son elementos de lista, y para un lector de pantalla los tres pasos
            dejaban de ser una lista. */}
        {CLAVES_PASO.map((clave, indice) => (
          <RevelarEnScroll
            key={clave}
            como="li"
            retardo={indice * 0.08}
            className={cn("group relative h-full", TARJETA, TARJETA_AIRE, TARJETA_VIVA)}
          >
            <span className={PASO}>{String(indice + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-base font-semibold tracking-tight text-balance">
              {t(`pasos.${clave}.titulo`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`pasos.${clave}.descripcion`)}
            </p>
            {/* Hilo entre pasos: la secuencia se ve, no se deduce */}
            {indice < CLAVES_PASO.length - 1 && (
              <span
                className="absolute top-1/2 -right-3 hidden h-px w-6 bg-border sm:block"
                aria-hidden
              />
            )}
          </RevelarEnScroll>
        ))}
      </ol>

      <div
        className={
          resumen ? "mt-12" : "mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-5 lg:gap-10"
        }
      >
        <RevelarEnScroll recorrido="izquierda" className={resumen ? undefined : "lg:col-span-3"}>
          <MarcoPanel />
        </RevelarEnScroll>

        {!resumen && (
          <RevelarEnScroll recorrido="derecha" retardo={0.12} className="lg:col-span-2">
            <figure>
              <EscaparateDemo region={region} />
              <figcaption className="mt-3 text-sm text-muted-foreground">
                {t("pieDelEscaparate")}
              </figcaption>
            </figure>
          </RevelarEnScroll>
        )}
      </div>
    </Seccion>
  )
}

/** Los nombres de persona no se traducen: traducir un nombre es inventárselo. */
const filas = [
  { hora: "09:00", cliente: "Andrés Villa", servicio: "corteBarba", barbero: "Iván" },
  { hora: "10:30", cliente: "Julián Mesa", servicio: "fadeClasico", barbero: "Duván" },
  { hora: "11:30", cliente: "Samuel Ríos", servicio: "navaja", barbero: "Iván" },
  { hora: "12:15", cliente: "Mateo Cano", servicio: "corteNino", barbero: "Duván" },
] as const

function MarcoPanel() {
  const t = useTranslations("vistaPrevia.maqueta")
  const pie = useTranslations("vistaPrevia")
  const servicio = useTranslations("maquetas.servicios")

  return (
    <figure>
      <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[box-shadow,transform,border-color] duration-300 hover:border-primary/30 hover:shadow-xl motion-safe:hover:-translate-y-1">
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

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-semibold">{t("citasDeHoy")}</h3>
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
            {filas.map((fila) => (
              <li
                key={fila.hora}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-secondary"
              >
                <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                  {fila.hora}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{fila.cliente}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {servicio(fila.servicio)} · {fila.barbero}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-(--exito)/10 px-2 py-0.5 text-[10px] font-medium text-(--exito)">
                  <Check className="size-3" aria-hidden />
                  {t("confirmada")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">{pie("pieDelPanel")}</figcaption>
    </figure>
  )
}
