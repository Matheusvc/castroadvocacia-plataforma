import type { ChatContact, ChatMessage } from "@/types/chat";

const MINUTE = 60_000;
const now = Date.now();

/** Contato da conversa de demonstração. */
export const mockContact: ChatContact = {
  name: "Dra. Helena Castro",
  initials: "HC",
  role: "Advogada responsável",
  online: true,
};

/** Histórico inicial de mensagens para demonstração. */
export const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    author: "them",
    text: "Bom dia! Aqui é a Dra. Helena, do escritório Castro Advocacia. Como posso ajudar?",
    createdAt: now - 22 * MINUTE,
  },
  {
    id: "m2",
    author: "me",
    text: "Bom dia, doutora! Gostaria de saber como está o andamento do meu processo trabalhista.",
    createdAt: now - 20 * MINUTE,
    status: "sent",
  },
  {
    id: "m3",
    author: "them",
    text: "Claro! O processo teve uma movimentação ontem: o juiz designou audiência de conciliação.",
    createdAt: now - 18 * MINUTE,
  },
  {
    id: "m4",
    author: "them",
    text: "A audiência ficou marcada para o dia 28/10, às 14h, no Fórum Trabalhista.",
    createdAt: now - 18 * MINUTE + 10_000,
  },
  {
    id: "m5",
    author: "me",
    text: "Perfeito. Preciso levar algum documento específico?",
    createdAt: now - 6 * MINUTE,
    status: "sent",
  },
  {
    id: "m6",
    author: "them",
    text: "Leve um documento com foto e os comprovantes de pagamento que você me enviou. Eu levo o restante.",
    createdAt: now - 5 * MINUTE,
  },
];
