import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { rutas, rutasApp } from "@/config/rutas"
import { Button } from "@/components/ui/button"

/**
 * Solo el título: el `noindex` lo pone Next solo en esta página, y declararlo
 * otra vez sale como dos `<meta name="robots">` en la misma cabecera.
 *
 * El título sí hace falta — sin él, una dirección equivocada se lista en el
 * historial y en las pestañas con el mismo nombre que la portada.
 */
export const metadata: Metadata = {
  title: "Página no encontrada",
}

/**
 * 404 del sitio público. Hereda cabecera y pie del layout raíz, así que una
 * dirección equivocada deja al visitante DENTRO del sitio en vez de en una
 * pantalla en blanco con dos palabras.
 */
export default function NoEncontrada() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-xs font-medium tracking-widest text-primary uppercase">Error 404</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          render={<Link href={rutas.inicio} />}
          nativeButton={false}
          size="lg"
          className="h-12 rounded-xl px-6 font-semibold"
        >
          <ArrowLeft aria-hidden />
          Volver al inicio
        </Button>
        <Button
          render={<a href={rutasApp.entrar} />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-12 rounded-xl px-6 font-semibold"
        >
          Iniciar sesión
        </Button>
      </div>
    </section>
  )
}
