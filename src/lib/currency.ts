/** Formatação de moeda brasileira (BRL). */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um número em reais: 1234.56 → "R$ 1.234,56". */
export function formatBRL(value: number): string {
  return brl.format(value);
}

/**
 * Máscara de entrada de moeda: interpreta os dígitos como centavos e
 * reformata ("18000" → "R$ 180,00"). Retorna "" quando não há dígitos,
 * para que o campo possa ficar vazio.
 */
export function maskCurrencyInput(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  return formatBRL(Number(digits) / 100);
}

/** Normaliza um valor armazenado para exibição; vazio vira "—". */
export function formatTotalDisplay(stored: string): string {
  return maskCurrencyInput(stored) || "—";
}
