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

/** Processos administrativos por status (mock). */
export interface AdminProcessStats {
  open: number;
  inAnalysis: number;
  granted: number;
  pending: number;
}

export const adminProcessStats: AdminProcessStats = {
  open: 11,
  inAnalysis: 7,
  granted: 15,
  pending: 4,
};

/** Processos judiciais por status (mock). */
export interface JudicialProcessStats {
  denied: number;
  inCourt: number;
  settlementOffer: number;
  favorableRuling: number;
  pending: number;
}

export const judicialProcessStats: JudicialProcessStats = {
  denied: 5,
  inCourt: 22,
  settlementOffer: 8,
  favorableRuling: 12,
  pending: 6,
};
