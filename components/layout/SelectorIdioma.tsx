"use client"

import { useLocale, useTranslations } from "next-intl"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { nombresDeIdioma } from "@/config/idiomas"
import { usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { useIdiomaStore } from "@/store/idioma.store"

/**
 * Cambiar de idioma sin perder la página en la que se está.
 *
 * ── Carga completa, NO navegación de cliente ────────────────────────────────
 * Cambiar de idioma cambia el DOCUMENTO: el `<html lang>` y con él el layout
 * raíz entero, que en este sitio vive dentro de `[idioma]`. Una navegación de
 * cliente intentaría re-renderizar ese layout en el navegador, y dentro está el
 * `<script>` que `next-themes` monta para aplicar el tema antes de pintar. React
 * no ejecuta un `<script>` que aparece en un render de cliente: avisa por
 * consola y la navegación se queda a medias. Ese fue el fallo real —se pulsaba
 * «English» y no pasaba nada—, así que aquí se navega con el navegador.
 *
 * ── Quién recuerda la elección ──────────────────────────────────────────────
 * `useIdiomaStore.fijar` escribe las dos: el store (persistente, sobrevive a que
 * se borren las cookies) y la cookie espejo, que es la única que el servidor
 * puede leer para decidir a dónde mandar a quien entra por `/`.
 *
 * ── Lo que este control NO hace ─────────────────────────────────────────────
 * Servir de pista a un rastreador: el desplegable no monta su contenido hasta
 * abrirlo, así que estas anclas no están en el HTML servido. Quien conecta las
 * dos versiones es el `<link rel="alternate" hreflang>` de la cabecera. Y por lo
 * mismo, necesita JavaScript.
 *
 * `usePathname` es el de `i18n/navigation`: devuelve la ruta **sin** el prefijo
 * de idioma, así que componer la del otro es concatenar y no recortar.
 */
export function SelectorIdioma() {
  const t = useTranslations("idioma")
  const actual = useLocale()
  const ruta = usePathname()
  // El ancla lleva el destino; esto solo deja escrita la preferencia —store y
  // cookie— antes de que el navegador se vaya.
  const fijar = useIdiomaStore((estado) => estado.fijar)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label={t("cambiar")}>
            <Languages aria-hidden />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {routing.locales.map((codigo) => (
          <DropdownMenuItem
            key={codigo}
            // El nombre de cada idioma va SIEMPRE en ese idioma: quien busca
            // «English» en un menú en español no reconocería «Inglés».
            render={
              <a
                href={`/${codigo}${ruta === "/" ? "" : ruta}`}
                hrefLang={codigo}
                onClick={() => fijar(codigo)}
                aria-current={codigo === actual ? "true" : undefined}
              >
                {nombresDeIdioma[codigo]}
              </a>
            }
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
