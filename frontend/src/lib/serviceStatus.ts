import type { ServiceStatus } from "@/types/entities";

export interface StatusOption {
  value: ServiceStatus;
  label: string;
}

/** Ordem e rótulos canônicos dos status de serviço, usados no filtro, no formulário e na exportação. */
export const SERVICE_STATUS_OPTIONS: StatusOption[] = [
  { value: "open", label: "Aberto" },
  { value: "progress", label: "Em atendimento" },
  { value: "done", label: "Encerrado" },
  { value: "analise", label: "Em análise" },
];

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> =
  Object.fromEntries(
    SERVICE_STATUS_OPTIONS.map((o) => [o.value, o.label]),
  ) as Record<ServiceStatus, string>;
