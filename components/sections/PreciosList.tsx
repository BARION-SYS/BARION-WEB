import { useTranslations } from "next-intl"
import { EncabezadoSeccion } from "@/components/sections/EncabezadoSeccion"
import { PreciosGrid } from "@/components/sections/PreciosGrid"
import { RegionSelect } from "@/components/sections/RegionSelect"
import { Seccion } from "@/components/sections/Seccion"
import { CLAVES_GARANTIA, iconosGarantia } from "@/config/contenido"
import type { CodigoRegion } from "@/config/regiones"
import type { PlanPublico } from "@/types/landing"

interface PreciosListProps {
  planes: PlanPublico[]
  region: CodigoRegion
  /** Dónde opera Barion, según la API. Solo estos se pueden elegir. */
  operados: CodigoRegion[]
  nivel?: "h1" | "h2"
  /**
   * En la portada se recorta lo que se pregunta DESPUÉS de decidir —las
   * garantías de cualquier plan—, que ahora vive en el cierre y en `/precios`.
   *
   * El selector de país **no se recorta**: sin él, quien no está en Colombia lee
   * un precio que no es el suyo, y eso no es un detalle que se pueda dejar para
   * la página siguiente.
   */
  resumen?: boolean
  enlace?: { href: string; texto: string }
  tono?: "base" | "alterno"
  separador?: boolean
}

/**
 * La sección que decide. Se renderiza en servidor con los precios ya resueltos:
 * sin parpadeo de «cargando» y con las cifras en el HTML de origen, que es lo
 * que ve el buscador.
 *
 * Dos elecciones y viajan distinto, a propósito: el **país** vuelve al servidor
 * porque decide qué precios existen, y el **período** se resuelve en el cliente
 * porque los tres ya vinieron en la misma respuesta.
 */
export function PreciosList({
  planes,
  region,
  operados,
  nivel = "h2",
  resumen = false,
  enlace,
  tono = "base",
  separador = true,
}: PreciosListProps) {
  const t = useTranslations("precios")

  return (
    <Seccion tono={tono} separador={separador}>
      <EncabezadoSeccion
        etiqueta={t("etiqueta")}
        titulo={t("titulo")}
        entrada={t("entrada")}
        nivel={nivel}
        enlace={enlace}
        // El selector solo en la página de precios: en la portada competiría
        // con el CTA por la misma esquina, y quien está mirando por encima
        // todavía no está eligiendo país.
        acompanante={<RegionSelect region={region} operados={operados} />}
      />

      <PreciosGrid planes={planes} region={region} />

      {/* Lo que trae CUALQUIER plan: es lo que se pregunta justo después de
            mirar los precios, y responderlo aquí evita una tabla comparativa */}
      {!resumen && (
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm font-medium">{t("incluyen")}</p>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {CLAVES_GARANTIA.map((clave) => {
              const Icono = iconosGarantia[clave]
              return (
                <li key={clave} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icono className="size-4 shrink-0 text-primary" aria-hidden />
                  {t(`garantias.${clave}`)}
                </li>
              )
            })}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">{t("prueba")}</p>
        </div>
      )}
    </Seccion>
  )
}
