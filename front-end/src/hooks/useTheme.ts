import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "castro.theme";
const TRANSITION_CLASS = "theme-transition";
const TRANSITION_MS = 250;

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function prefersDark(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? (prefersDark() ? "dark" : "light");
}

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * Tema light/dark do app: persistido em localStorage ("castro.theme"), com
 * fallback para `prefers-color-scheme` do sistema na primeira visita.
 * Alterna a classe "dark" em <html> (consumida pelas classes `dark:` do
 * Tailwind) e envolve a troca numa transição suave e breve.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = resolveInitialTheme();
    applyThemeClass(initial);
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignora: storage cheio/bloqueado
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.add(TRANSITION_CLASS);
    window.setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);

    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyThemeClass(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme, isDark: theme === "dark" };
}
