"use client"

import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMontado } from "@/hooks/useMontado"

/**
 * Único control de tema del sitio — no duplicarlo.
 *
 * Sus textos los pide él (`useTranslations`), no se los baja nadie. Es lo que
 * cambió al pasar a next-intl y no es solo comodidad: mientras el diccionario
 * viajaba por props, cada componente cliente dependía de que su padre le pasara
 * la porción correcta, y bastaba que esa porción llevara una función para que la
 * página reventara al serializarla.
 */
export function ThemeToggle() {
  const t = useTranslations("tema")
  const { theme, setTheme } = useTheme()
  const montado = useMontado()

  if (!montado) {
    return <Button variant="outline" size="icon" aria-label={t("cambiar")} disabled />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label={t("cambiar")}>
            {theme === "light" ? (
              <Sun aria-hidden />
            ) : theme === "dark" ? (
              <Moon aria-hidden />
            ) : (
              <Monitor aria-hidden />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun aria-hidden /> {t("claro")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon aria-hidden /> {t("oscuro")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor aria-hidden /> {t("sistema")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
