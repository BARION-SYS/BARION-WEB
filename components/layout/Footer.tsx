import { Mail } from "lucide-react"
import { anclas, CORREO_CONTACTO, rutasApp, rutasMaquina } from "@/config/rutas"
import { LogoBarion } from "@/components/brand/LogoBarion"

// Anclas de esta página y destinos de la aplicación conviven en la misma lista:
// unas se resuelven en el DOM y otras salen a otro dominio, y por eso TODAS se
// pintan con `<a>` — `next/link` no aporta nada sobre ninguna de las dos.
const columnas = [
  {
    titulo: "Producto",
    enlaces: [
      { href: anclas.producto, texto: "Qué hace" },
      { href: anclas.vistaPrevia, texto: "Cómo se ve" },
      { href: anclas.precios, texto: "Precios" },
      { href: anclas.preguntas, texto: "Preguntas frecuentes" },
    ],
  },
  {
    titulo: "Empezar",
    enlaces: [
      { href: rutasApp.registro, texto: "Crear mi barbería" },
      { href: rutasApp.entrar, texto: "Entrar al panel" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-background py-14">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-8 lg:px-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-2">
            <LogoBarion variante="completo" className="h-7" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Gestión para barberías modernas. Colombia, Estados Unidos y España.
            </p>
            <a
              href={`mailto:${CORREO_CONTACTO}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="size-4" aria-hidden />
              {CORREO_CONTACTO}
            </a>
          </div>

          {columnas.map((columna) => (
            <div key={columna.titulo}>
              <h2 className="text-sm font-semibold">{columna.titulo}</h2>
              <ul className="mt-4 space-y-1">
                {columna.enlaces.map((enlace) => (
                  <li key={enlace.href}>
                    <a
                      href={enlace.href}
                      className="group inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                        {enlace.texto}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Barion. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            {/* El único enlace real a `/llms.txt`. Un rastreador llega a una
                dirección porque alguien enlaza a ella: sin esto, el archivo
                existe y no lo encuentra nadie. */}
            <a
              href={rutasMaquina.llms}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              llms.txt
            </a>
            {/* Discreto a propósito: esta puerta la usan cinco personas por
                barbería, no quinientas. No compite con el registro. */}
            <a
              href={rutasApp.entrar}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
