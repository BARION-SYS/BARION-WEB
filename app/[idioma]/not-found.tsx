import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { rutas, rutasApp } from "@/config/rutas"
import { Link } from "@/i18n/navigation"

/**
 * 404 dentro de un idioma.
 *
 * Se renderiza cuando la ruta no casó con ninguna página, así que **no recibe
 * `params`**: el idioma lo resuelve next-intl con el de la petición, que ya
 * fijó el proxy. Sigue estando dentro del layout, con su cabecera y su pie, así
 * que desde aquí se navega a cualquier sitio.
 *
 * El `noindex` lo pone Next solo en esta página; declararlo otra vez saldría
 * como dos `<meta name="robots">` en la misma cabecera.
 */
export default function NoEncontrada() {
  const t = useTranslations("noEncontrada")
  const nav = useTranslations("navegacion")

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-xs font-medium tracking-widest text-primary uppercase">{t("codigo")}</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {t("titulo")}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        {t("entrada")}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          render={<Link href={rutas.inicio} />}
          nativeButton={false}
          size="lg"
          className="h-12 rounded-xl px-6 font-semibold"
        >
          <ArrowLeft aria-hidden />
          {t("volver")}
        </Button>
        <Button
          render={<a href={rutasApp.entrar} />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-12 rounded-xl px-6 font-semibold"
        >
          {nav("entrar")}
        </Button>
      </div>
    </section>
  )
}
