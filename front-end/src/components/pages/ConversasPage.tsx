import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { cn } from "@/lib/cn";
import { mockConversations } from "@/data/mockConversations";
import { ConversationList } from "@/components/conversas/ConversationList";
import { ChatPanel } from "@/components/chat/ChatPanel";

/**
 * Página Conversas: lista de quem pediu "falar com o atendente" + chat.
 * - Desktop: lista à esquerda e chat à direita (duas colunas).
 * - Mobile: mostra a lista; ao escolher uma pessoa, abre o chat (com voltar).
 */
export function ConversasPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const selected = mockConversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex min-h-0 flex-1">
      {/* Lista (escondida no mobile quando um chat está aberto) */}
      <div
        className={cn(
          "min-h-0 w-full flex-col border-border-light dark:border-night-border lg:flex lg:w-[320px] lg:shrink-0 lg:border-r xl:w-[380px]",
          selectedId ? "hidden lg:flex" : "flex",
        )}
      >
        <ConversationList
          conversations={mockConversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          query={query}
          onQueryChange={setQuery}
        />
      </div>

      {/* Chat da conversa selecionada */}
      <div
        className={cn(
          "min-h-0 flex-1 flex-col",
          selected ? "flex" : "hidden lg:flex",
        )}
      >
        {selected ? (
          <ChatPanel
            key={selected.id}
            contact={selected.contact}
            initialMessages={selected.messages}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-gray-600 p-8 text-center dark:bg-night-bg">
            <span className="flex size-16 items-center justify-center rounded-full bg-blue-base/10 text-blue-dark">
              <MessagesSquare size={28} aria-hidden="true" />
            </span>
            <p className="text-lg font-bold text-gray-100 dark:text-night-text">
              Selecione uma conversa
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              Escolha uma pessoa na lista para ver o histórico e responder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
