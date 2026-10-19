/** Tipos das entidades das tabelas (Clientes e Serviços). */

export interface Client {
  id: string;
  name: string;
  initials: string;
  /** CPF formatado (ex.: "123.456.789-00"). */
  cpf: string;
  /** Número do processo (ex.: "0001234-56.2025.8.26.0100"). */
  processNumber: string;
}

/**
 * Status de um serviço (Figma: feedback/open, /progress, /done).
 * "analise" não existia no Figma; foi adicionado para o fluxo de triagem.
 */
export type ServiceStatus = "open" | "progress" | "done" | "analise";

export interface Service {
  /** Id exibido (ex.: "00003"). */
  id: string;
  /** Data/hora de atualização já formatada (ex.: "13/04/25 20:56"). */
  updatedAt: string;
  title: string;
  /** Tipo de serviço (subtítulo). */
  service: string;
  /** Valor total já formatado (ex.: "R$ 180,00"). */
  total: string;
  owner: {
    name: string;
    initials: string;
  };
  status: ServiceStatus;
}
