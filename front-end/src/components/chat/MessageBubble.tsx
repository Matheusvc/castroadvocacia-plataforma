import { memo } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/chat";
import { Avatar } from "@/components/layout/Avatar";
import { Timestamp } from "./Timestamp";
import { MessageStatusIcon } from "./MessageStatusIcon";

interface MessageBubbleProps {
  message: ChatMessage;
  /** Iniciais do interlocutor (avatar das mensagens recebidas). */
  contactInitials: string;
  onRetry: (id: string) => void;
  /** Abre a imagem em tela cheia. */
  onOpenImage: (src: string, alt: string) => void;
}

function MessageBubbleBase({
  message,
  contactInitials,
  onRetry,
  onOpenImage,
}: MessageBubbleProps) {
  const isMe = message.author === "me";
  const isError = message.status === "error";
  const hasImage = Boolean(message.image);
  const imageAlt = isMe ? "Imagem enviada" : "Imagem recebida";

  return (
    <li
      className={cn(
        "flex w-full animate-fade-in-up items-end gap-2",
        isMe ? "justify-end" : "justify-start",
      )}
    >
      {!isMe && (
        <Avatar initials={contactInitials} size="sm" className="mb-5" />
      )}

      <div
        className={cn(
          "flex min-w-0 flex-col gap-1",
          hasImage ? "max-w-[75%] sm:max-w-[300px]" : "max-w-[78%] sm:max-w-[70%]",
          isMe ? "items-end" : "items-start",
        )}
      >
        {hasImage ? (
          <button
            type="button"
            onClick={() => onOpenImage(message.image as string, imageAlt)}
            aria-label={`${imageAlt} — ampliar`}
            className="group relative block w-60 shrink-0 overflow-hidden rounded-bubble focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base sm:w-72"
          >
            <img
              src={message.image}
              alt={imageAlt}
              loading="lazy"
              className="block h-44 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02] sm:h-52"
            />
            <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-gray-600">
              <Timestamp value={message.createdAt} />
              {isMe && message.status && (
                <MessageStatusIcon status={message.status} />
              )}
            </span>
          </button>
        ) : (
          <>
            <div
              className={cn(
                "rounded-bubble px-4 py-2.5 text-base leading-[1.5]",
                "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                isMe
                  ? "rounded-br-[4px] bg-bubble-sent text-gray-600"
                  : "rounded-tl-[4px] bg-bubble-received text-gray-100 shadow-[0_1px_2px_rgba(21,22,25,0.06)] dark:bg-night-surface dark:text-night-text dark:shadow-none",
                isError && "bg-danger/10 text-gray-100 shadow-none ring-1 ring-danger/40 dark:text-night-text",
              )}
            >
              {message.text}
            </div>

            <div
              className={cn(
                "flex items-center gap-1.5 px-1 text-gray-400",
                isMe ? "flex-row-reverse" : "flex-row",
              )}
            >
              <Timestamp value={message.createdAt} />
              {isMe && message.status && (
                <MessageStatusIcon status={message.status} />
              )}
            </div>
          </>
        )}

        {isError && (
          <button
            type="button"
            onClick={() => onRetry(message.id)}
            className="inline-flex items-center gap-1 rounded-sm px-1 text-xs font-bold text-danger transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            <RotateCcw size={12} aria-hidden="true" />
            Tentar novamente
          </button>
        )}
      </div>
    </li>
  );
}

export const MessageBubble = memo(MessageBubbleBase);
