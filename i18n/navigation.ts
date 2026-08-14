import { createNavigation } from "next-intl/navigation"
import { routing } from "@/i18n/routing"

/**
 * Navegación consciente del idioma.
 *
 * `Link` y compañía añaden solos el prefijo del idioma activo, así que dentro
 * del sitio se enlaza a `/precios` y sale `/es/precios` o `/en/precios` según
 * dónde se esté. Eso elimina la clase de fallo más aburrida de un sitio
 * multi-idioma: el enlace que se escribió con el prefijo cableado y devuelve al
 * visitante al español a mitad de la navegación.
 *
 * **`redirect` y `getPathname` no se usan todavía** y se exportan igual: son la
 * misma pieza y sacarlos de aquí el día que hagan falta es peor que tenerlos.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
