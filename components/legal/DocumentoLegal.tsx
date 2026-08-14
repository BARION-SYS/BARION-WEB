import { useTranslations } from "next-intl"
import { Migas } from "@/components/common/Migas"
import { NavegacionLegal, type ClaveDocumentoLegal } from "@/components/legal/NavegacionLegal"
import { CORREO_CONTACTO } from "@/config/rutas"
import { CONTENEDOR } from "@/lib/superficies"
import { cn } from "@/lib/utils"
import { VERSION_LEGAL, VIGENTE_DESDE } from "@/config/legal"
import type { BloqueLegal, DocumentoLegal as Documento } from "@/constants/legal/tipos"

/**
 * Cómo se pinta un documento legal. Uno solo para los tres.
 *
 * Server Component sin una línea de JavaScript, y no por ahorro: un documento
 * legal tiene que estar ENTERO en el HTML de origen. Si una sección se montara
 * al desplegarla, quien lo lea con un lector de pantalla, quien lo imprima a PDF
 * y quien lo busque con «buscar en la página» verían un documento distinto del
 * que se aceptó — y el que vale es el que se aceptó.
 *
 * El índice es lateral y fijo porque estos textos se leen a saltos: casi nadie
 * lee unos términos de arriba abajo, se busca el apartado del cobro o el de la
 * cancelación. Cada sección lleva su ancla, así que un enlace a un apartado
 * concreto se puede compartir y sigue valiendo mientras el apartado exista.
 */

function Bloque({ bloque }: { bloque: BloqueLegal }) {
  if (bloque.tipo === "parrafo") {
    return <p className="text-sm leading-relaxed text-muted-foreground">{bloque.texto}</p>
  }

  if (bloque.tipo === "lista") {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-primary">
        {bloque.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  return (
    // La tabla scrollea DENTRO de su caja: en un móvil, una tabla de cuatro
    // columnas que empuja el ancho del documento deja el texto de todas las
    // secciones desplazándose de lado.
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {bloque.cabecera.map((celda) => (
              <th key={celda} scope="col" className="px-4 py-3 font-medium">
                {celda}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {bloque.filas.map((fila) => (
            <tr key={fila.join("·")}>
              {fila.map((celda, columna) => (
                <td
                  key={celda}
                  className={
                    columna === 0
                      ? "px-4 py-3 align-top font-medium"
                      : "px-4 py-3 align-top leading-relaxed text-muted-foreground"
                  }
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface DocumentoLegalProps {
  documento: Documento
  /** Cuál de los tres es, para marcarlo en la navegación entre ellos. */
  clave: ClaveDocumentoLegal
  /**
   * Aviso de que este texto está redactado en otro idioma y cuál es el que rige.
   * `null` cuando se está sirviendo el original.
   *
   * Va arriba del todo y no en una nota al pie: quien lo necesita tiene que
   * leerlo ANTES del documento, no después de haberlo dado por entendido.
   */
  avisoIdioma?: string | null
}

export function DocumentoLegal({ documento, clave, avisoIdioma }: DocumentoLegalProps) {
  const t = useTranslations("legal")

  return (
    <article className={cn(CONTENEDOR, "pt-28 pb-24 lg:pt-32")}>
      {/* Lo primero de la página: dónde se está y por dónde se sale. Antes se
          aterrizaba aquí desde el pie y la cabecera no marcaba nada como activo
          —ninguna de sus secciones es «legal»—, así que el documento parecía no
          tener vuelta atrás. */}
      <Migas migas={[{ texto: t("titulo") }, { texto: documento.titulo }]} />

      <div className="mt-8 max-w-3xl">
        {avisoIdioma && (
          <p
            role="note"
            className="mb-8 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
          >
            {avisoIdioma}
          </p>
        )}
        <p className="text-xs font-medium tracking-widest text-primary uppercase">Legal</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {documento.titulo}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {documento.entradilla}
        </p>
        {/* La versión no es un adorno: es exactamente la cadena que queda
            guardada como «lo que esta barbería aceptó» al darse de alta. */}
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">Versión</dt>
            <dd>{VERSION_LEGAL}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium text-foreground">En vigor desde</dt>
            <dd>{VIGENTE_DESDE}</dd>
          </div>
        </dl>
      </div>

      {/* Los tres se leen juntos: quien mira los términos casi siempre quiere
          ver después qué se hace con sus datos. */}
      <div className="mt-10 border-t border-border pt-8">
        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {t("otrosDocumentos")}
        </p>
        <NavegacionLegal actual={clave} />
      </div>

      <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <nav
          aria-label="Índice del documento"
          className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
        >
          <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            En esta página
          </h2>
          <ol className="mt-4 flex flex-col gap-1">
            {documento.secciones.map((seccion, indice) => (
              <li key={seccion.id}>
                <a
                  href={`#${seccion.id}`}
                  className="flex min-h-11 items-baseline gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="text-primary tabular-nums">{indice + 1}.</span>
                  {seccion.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-12 lg:col-span-8">
          {documento.secciones.map((seccion, indice) => (
            <section key={seccion.id} id={seccion.id} className="scroll-mt-28">
              <h2 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                <span className="mr-2 text-primary tabular-nums">{indice + 1}.</span>
                {seccion.titulo}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {seccion.bloques.map((bloque, posicion) => (
                  <Bloque key={posicion} bloque={bloque} />
                ))}
              </div>
            </section>
          ))}

          <p className="border-t border-border pt-6 text-sm text-muted-foreground">
            ¿Alguna duda sobre este documento? Escríbenos a{" "}
            <a href={`mailto:${CORREO_CONTACTO}`} className="text-primary hover:underline">
              {CORREO_CONTACTO}
            </a>
            .
          </p>
        </div>
      </div>
    </article>
  )
}
