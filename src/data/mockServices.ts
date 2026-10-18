import type { Service } from "@/types/entities";

/** Serviços mockados (Figma — página Serviços). */
export const mockServices: Service[] = [
  {
    id: "00003",
    updatedAt: "13/04/25 20:56",
    title: "Rede lenta",
    service: "Instalação de Rede",
    total: "R$ 180,00",
    owner: { name: "Carlos Silva", initials: "CS" },
    status: "open",
  },
  {
    id: "00004",
    updatedAt: "12/04/25 15:20",
    title: "Backup não está funcionando",
    service: "Recuperação de Dados",
    total: "R$ 200,00",
    owner: { name: "Carlos Silva", initials: "CS" },
    status: "open",
  },
  {
    id: "00001",
    updatedAt: "12/04/25 09:01",
    title: "Computador não liga",
    service: "Manutenção de Hardware",
    total: "R$ 150,00",
    owner: { name: "Carlos Silva", initials: "CS" },
    status: "progress",
  },
  {
    id: "00002",
    updatedAt: "10/04/25 10:15",
    title: "Instalação de software de gestão",
    service: "Suporte de Software",
    total: "R$ 200,00",
    owner: { name: "Ana Oliveira", initials: "AO" },
    status: "done",
  },
  {
    id: "00005",
    updatedAt: "11/04/25 15:16",
    title: "Meu fone não conecta no computador",
    service: "Suporte de Software",
    total: "R$ 80,00",
    owner: { name: "Ana Oliveira", initials: "AO" },
    status: "done",
  },
];
