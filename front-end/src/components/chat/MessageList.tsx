import { Fragment, useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  contactName: string;
  contactInitials: string;
  onRetry: (id: string) => void;
}

const dayFmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

function sameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function dayLabel(value: number): string {
  const today = Date.now();
  const yesterday = today - 86_400_000;
  if (sameDay(value, today)) return "Hoje";
  if (sameDay(value, yesterday)) return "Ontem";
  return dayFmt.format(new Date(value));
}

/**
 * Lista de mensagens com rolagem automática para o fim e separadores de dia.
 *
 * Performance: para históricos com centenas de itens, trocar o `map` por uma
 * lista virtualizada (ex.: @tanstack/react-virtual) mantendo o mesmo markup
 * semântico. Com o mock atual (poucas mensagens) não é necessário.
 */
export function MessageList({
  messages,
  isTyping,
  contactName,
  contactInitials,
  onRetry,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Rola para a última mensagem quando a lista muda ou o indicador aparece.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
    >
      <ul
        className="flex flex-col gap-4"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Mensagens da conversa"
      >
        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const showDay = !prev || !sameDay(prev.createdAt, message.createdAt);
          return (
            <Fragment key={message.id}>
              {showDay && (
                <li className="my-1 flex justify-center" aria-hidden="true">
                  <span className="rounded-full bg-border-light px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                    {dayLabel(message.createdAt)}
                  </span>
                </li>
              )}
              <MessageBubble
                message={message}
                contactInitials={contactInitials}
                onRetry={onRetry}
              />
            </Fragment>
          );
        })}

        {isTyping && (
          <TypingIndicator
            contactInitials={contactInitials}
            contactName={contactName}
          />
        )}
      </ul>
      <div ref={bottomRef} />
    </div>
  );
}
