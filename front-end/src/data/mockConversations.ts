import type { Conversation } from "@/types/chat";
import { mockReceiptImage } from "./mockImages";

const MIN = 60_000;
const now = Date.now();

/**
 * Pessoas que escolheram "Falar com o atendente" e aguardam/estão em atendimento.
 * Cada conversa traz seu próprio histórico de mensagens.
 */
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    contact: {
      name: "André Costa",
      initials: "AC",
      role: "Cliente",
      online: true,
      phone: "(11) 91234-5678",
      about: "Disponível",
    },
    lastMessage: "Gostaria de saber como está o andamento do meu processo.",
    lastTime: now - 2 * MIN,
    unread: 2,
    messages: [
      {
        id: "c1m1",
        author: "them",
        text: "Olá! Escolhi falar com um atendente, pode me ajudar?",
        createdAt: now - 8 * MIN,
      },
      {
        id: "c1m2",
        author: "them",
        text: "Gostaria de saber como está o andamento do meu processo.",
        createdAt: now - 2 * MIN,
      },
    ],
  },
  {
    id: "conv-2",
    contact: {
      name: "Julia Maria",
      initials: "JM",
      role: "Cliente",
      online: true,
      phone: "(11) 99876-5432",
      about: "Aguardando retorno sobre a reunião",
    },
    lastMessage: "Perfeito, muito obrigada pelo retorno!",
    lastTime: now - 26 * MIN,
    unread: 0,
    messages: [
      {
        id: "c2m1",
        author: "them",
        text: "Boa tarde! Preciso reagendar minha reunião.",
        createdAt: now - 40 * MIN,
      },
      {
        id: "c2m2",
        author: "me",
        text: "Boa tarde, Julia! Consigo encaixar na quinta às 10h. Funciona?",
        createdAt: now - 30 * MIN,
        status: "sent",
      },
      {
        id: "c2m3",
        author: "them",
        text: "Perfeito, muito obrigada pelo retorno!",
        createdAt: now - 26 * MIN,
      },
    ],
  },
  {
    id: "conv-3",
    contact: {
      name: "Marcelo Andrade",
      initials: "MA",
      role: "Cliente",
      online: false,
      phone: "(11) 93456-7890",
      about: "Prefere contato por telefone após as 18h",
    },
    lastMessage: "Enviei os documentos por e-mail, pode conferir?",
    lastTime: now - 3 * 60 * MIN,
    unread: 1,
    messages: [
      {
        id: "c3m1",
        author: "them",
        text: "Enviei os documentos por e-mail, pode conferir? Tirei uma foto também, segue aqui:",
        createdAt: now - 3 * 60 * MIN - 30_000,
      },
      {
        id: "c3m2",
        author: "them",
        image: mockReceiptImage("Documento — Marcelo Andrade"),
        createdAt: now - 3 * 60 * MIN,
      },
    ],
  },
  {
    id: "conv-4",
    contact: {
      name: "Aline Souza",
      initials: "AS",
      role: "Cliente",
      online: false,
      phone: "(11) 97654-3210",
      about: "Disponível",
    },
    lastMessage: "Obrigada! Fico no aguardo.",
    lastTime: now - 26 * 60 * MIN,
    unread: 0,
    messages: [
      {
        id: "c4m1",
        author: "them",
        text: "Quero falar com um atendente sobre a minha fatura.",
        createdAt: now - 27 * 60 * MIN,
      },
      {
        id: "c4m2",
        author: "me",
        text: "Claro! Já estou verificando aqui, Aline.",
        createdAt: now - 26 * 60 * MIN,
        status: "sent",
      },
      {
        id: "c4m3",
        author: "them",
        text: "Obrigada! Fico no aguardo.",
        createdAt: now - 26 * 60 * MIN + 20_000,
      },
    ],
  },
];
