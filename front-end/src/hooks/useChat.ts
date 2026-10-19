import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, MessageStatus } from "@/types/chat";
import { mockMessages } from "@/data/mockMessages";

/** Gera um id único (com fallback para ambientes sem crypto.randomUUID). */
function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Respostas automáticas simuladas do atendente. */
const AUTO_REPLIES = [
  "Entendido! Já registrei aqui no seu atendimento. 👍",
  "Perfeito. Vou verificar e te retorno ainda hoje.",
  "Anotado. Se precisar de mais alguma coisa, é só me chamar.",
  "Obrigada pela informação! Deixo tudo encaminhado.",
];

interface UseChatOptions {
  /** Atraso simulado de envio (ms). */
  sendDelay?: number;
  /** Atraso simulado da resposta automática (ms). */
  replyDelay?: number;
}

export interface UseChatResult {
  messages: ChatMessage[];
  /** True enquanto o atendente "digita" uma resposta. */
  isTyping: boolean;
  /** Envia uma nova mensagem do usuário. Retorna o id criado. */
  sendMessage: (text: string) => string | undefined;
  /** Reenvia uma mensagem que falhou. */
  retryMessage: (id: string) => void;
}

/**
 * Lógica de chat isolada da apresentação.
 *
 * Simulação de rede: uma mensagem cujo texto contém "erro" (ex.: para testar o
 * fluxo de falha) termina em status `error`; as demais vão para `sent` e
 * disparam uma resposta automática do atendente.
 */
export function useChat(
  initialMessages: ChatMessage[] = mockMessages,
  options: UseChatOptions = {},
): UseChatResult {
  const { sendDelay = 900, replyDelay = 1600 } = options;

  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Guarda timers pendentes para limpeza no unmount.
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const schedule = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, delay);
    timers.current.add(t);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const setStatus = useCallback((id: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    );
  }, []);

  const addAutoReply = useCallback(() => {
    setIsTyping(true);
    schedule(() => {
      const reply =
        AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)] ??
        AUTO_REPLIES[0];
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          author: "them",
          text: reply,
          createdAt: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, replyDelay);
  }, [replyDelay, schedule]);

  const deliver = useCallback(
    (id: string, text: string) => {
      const willFail = text.toLowerCase().includes("erro");
      schedule(() => {
        if (willFail) {
          setStatus(id, "error");
        } else {
          setStatus(id, "sent");
          addAutoReply();
        }
      }, sendDelay);
    },
    [addAutoReply, schedule, sendDelay, setStatus],
  );

  const sendMessage = useCallback(
    (raw: string): string | undefined => {
      const text = raw.trim();
      if (!text) return undefined;

      const id = createId();
      setMessages((prev) => [
        ...prev,
        {
          id,
          author: "me",
          text,
          createdAt: Date.now(),
          status: "sending",
        },
      ]);
      deliver(id, text);
      return id;
    },
    [deliver],
  );

  const retryMessage = useCallback(
    (id: string) => {
      let text: string | undefined;
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            text = m.text;
            return { ...m, status: "sending" };
          }
          return m;
        }),
      );
      if (text !== undefined) {
        deliver(id, text);
      }
    },
    [deliver],
  );

  return { messages, isTyping, sendMessage, retryMessage };
}
