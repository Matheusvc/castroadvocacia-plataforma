/**
 * Métricas agregadas de clientes para o Dashboard (mock).
 * total = active + inactive + pending.
 */
export interface ClientStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

export const clientStats: ClientStats = {
  total: 128,
  active: 84,
  inactive: 23,
  pending: 21,
};

/** Variação percentual vs. mês anterior (mock), por indicador. */
export const clientDeltas = {
  total: 12,
  active: 9,
  inactive: -4,
  pending: 6,
} as const;

/**
 * Processos jurídicos por status (mock). total = open + inAnalysis + done + pending.
 */
export interface ProcessStats {
  total: number;
  open: number;
  inAnalysis: number;
  done: number;
  pending: number;
}

export const processStats: ProcessStats = {
  total: 46,
  open: 14,
  inAnalysis: 18,
  done: 9,
  pending: 5,
};
