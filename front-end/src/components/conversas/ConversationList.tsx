import { useMemo } from "react";
import type { Conversation } from "@/types/chat";
import { SearchInput } from "@/components/ui/SearchInput";
import { ConversationListItem } from "./ConversationListItem";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
}

/** Lista de pessoas que pediram "falar com o atendente", com busca. */
export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  query,
  onQueryChange,
}: ConversationListProps) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.contact.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const waiting = conversations.filter((c) => c.unread > 0).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 flex-col gap-4 px-5 pb-4 pt-5">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-100 dark:text-night-text">
            Conversas
          </h1>
          {waiting > 0 && (
            <span className="shrink-0 text-xs font-bold text-status-open">
              {waiting} aguardando
            </span>
          )}
        </div>
        <SearchInput
          value={query}
          onChange={onQueryChange}
          label="Buscar conversas"
          placeholder="Buscar pessoa…"
        />
      </header>

      <nav
        aria-label="Lista de conversas"
        className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-2 pb-2"
      >
        {filtered.length > 0 ? (
          <ul className="flex flex-col gap-0.5">
            {filtered.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-gray-400">
            Nenhuma conversa encontrada.
          </p>
        )}
      </nav>
    </div>
  );
}
