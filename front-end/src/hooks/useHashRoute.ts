import { useCallback, useEffect, useState } from "react";

/**
 * Roteamento mínimo baseado no hash da URL (ex.: #clientes).
 * Sincroniza com voltar/avançar do navegador e valida contra as rotas conhecidas.
 */
export function useHashRoute<T extends string>(
  routes: readonly T[],
  fallback: T,
): [T, (route: T) => void] {
  const parse = useCallback((): T => {
    const raw = window.location.hash.replace(/^#/, "");
    return (routes as readonly string[]).includes(raw) ? (raw as T) : fallback;
  }, [routes, fallback]);

  const [route, setRoute] = useState<T>(parse);

  useEffect(() => {
    const onHashChange = () => setRoute(parse());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [parse]);

  const navigate = useCallback((next: T) => {
    if (window.location.hash.replace(/^#/, "") !== next) {
      window.location.hash = next;
    }
    setRoute(next);
  }, []);

  return [route, navigate];
}
