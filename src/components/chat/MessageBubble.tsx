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
}

function MessageBubbleBase({
  message,
  contactInitials,
  onRetry,
}: MessageBubbleProps) {
  const isMe = message.author === "me";
  const isError = message.status === "error";

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
          "flex min-w-0 max-w-[78%] flex-col gap-1 sm:max-w-[70%]",
          isMe ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-bubble px-4 py-2.5 text-base leading-[1.5] shadow-sm",
            "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
            isMe
              ? "rounded-br-[4px] bg-bubble-sent text-gray-600"
              : "rounded-tl-[4px] border border-border-light bg-bubble-received text-gray-100",
            isError && "bg-danger/10 text-gray-100 ring-1 ring-danger/40",
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
            <span
              className={cn(
                "inline-flex items-center",
                isError ? "text-danger" : "text-gray-400",
              )}
            >
              <MessageStatusIcon status={message.status} />
            </span>
          )}
        </div>

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
