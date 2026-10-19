import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

/**
 * useState espelhado em localStorage.
 * Tolerante a falhas (modo privado, dados corrompidos, storage bloqueado):
 * toda leitura/escrita é protegida e cai no valor inicial quando necessário.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      // ignora: storage indisponível ou JSON inválido
    }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignora: storage cheio/bloqueado
    }
  }, [key, state]);

  return [state, setState];
}
