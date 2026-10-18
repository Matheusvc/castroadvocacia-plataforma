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
      <header className="flex shrink-0 flex-col gap-3 border-b border-border-light px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold leading-tight text-gray-100">
            Conversas
          </h1>
          {waiting > 0 && (
            <span className="inline-flex items-center rounded-full bg-status-open/15 px-2 py-0.5 text-xs font-bold text-status-open">
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
        className="scrollbar-slim min-h-0 flex-1 overflow-y-auto"
      >
        {filtered.length > 0 ? (
          <ul>
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
