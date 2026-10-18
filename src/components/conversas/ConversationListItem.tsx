import { cn } from "@/lib/cn";
import { Avatar } from "@/components/layout/Avatar";
import type { Conversation } from "@/types/chat";

interface ConversationListItemProps {
  conversation: Conversation;
  selected: boolean;
  onSelect: (id: string) => void;
}

const timeFmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Rótulo de tempo curto para a lista (HH:MM hoje, "Ontem", ou dd/mm). */
function shortTime(value: number): string {
  const d = new Date(value);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return timeFmt.format(d);
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

/** Item da lista de conversas (fila de atendimento). */
export function ConversationListItem({
  conversation,
  selected,
  onSelect,
}: ConversationListItemProps) {
  const { contact, lastMessage, lastTime, unread } = conversation;
  const hasUnread = unread > 0;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "relative flex w-full items-center gap-3 border-b border-border-light py-3 pl-4 pr-4 text-left transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-base",
          selected ? "bg-blue-base/[0.07]" : "hover:bg-gray-600",
        )}
      >
        {/* Barra de destaque do item selecionado */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-blue-base transition-opacity",
            selected ? "opacity-100" : "opacity-0",
          )}
        />
        <Avatar initials={contact.initials} size="md" online={contact.online} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-bold text-gray-100">
              {contact.name}
            </span>
            <span
              className={cn(
                "shrink-0 text-xs tabular-nums",
                hasUnread ? "font-bold text-blue-base" : "text-gray-400",
              )}
            >
              {shortTime(lastTime)}
            </span>
          </span>
          <span className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "truncate text-xs",
                hasUnread ? "text-gray-200" : "text-gray-400",
              )}
            >
              {lastMessage}
            </span>
            {hasUnread && (
              <span
                className="inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-base px-1.5 text-[11px] font-bold leading-5 text-gray-600"
                aria-label={`${unread} mensagens não lidas`}
              >
                {unread}
              </span>
            )}
          </span>
        </span>
      </button>
    </li>
  );
}
