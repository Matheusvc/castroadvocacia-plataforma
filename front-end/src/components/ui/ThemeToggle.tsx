import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

/**
 * Alterna entre modo claro e escuro. Mostra o ícone do modo para o qual o
 * clique leva (sol = voltar ao claro, lua = ir para o escuro), com
 * transição de rotação/opacidade entre os dois ícones.
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Alternar para modo claro" : "Alternar para modo escuro"}
      title={isDark ? "Alternar para modo claro" : "Alternar para modo escuro"}
      className="flex size-10 shrink-0 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-500/40 hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60 dark:hover:text-night-text"
    >
      <span className="relative flex size-[18px] items-center justify-center">
        <Sun
          size={18}
          aria-hidden="true"
          className={`absolute transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          size={18}
          aria-hidden="true"
          className={`absolute transition-all duration-300 ${
            isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
      </span>
    </button>
  );
}
