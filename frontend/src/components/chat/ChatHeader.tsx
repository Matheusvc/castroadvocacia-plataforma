import { ArrowLeft, MoreVertical, Phone } from "lucide-react";
import type { ChatContact } from "@/types/chat";
import { Avatar } from "@/components/layout/Avatar";

interface ChatHeaderProps {
  contact: ChatContact;
  /** Quando presente, exibe um botão de voltar (lista de conversas no mobile). */
  onBack?: () => void;
}

/**
 * Cabeçalho do chat (ocupa o slot de título do conteúdo do Figma).
 * Título em blue/dark, como o título de página original.
 */
export function ChatHeader({ contact, onBack }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border-light bg-surface px-4 py-4 sm:px-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para a lista de conversas"
          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base lg:hidden"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
      )}
      <Avatar initials={contact.initials} size="md" online={contact.online} />

      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-lg font-bold leading-[1.4] text-blue-dark lg:text-xl">
          {contact.name}
        </h1>
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <span
            className={
              contact.online ? "text-emerald-600" : "text-gray-400"
            }
          >
            {contact.online ? "Online agora" : "Offline"}
          </span>
          {contact.role && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{contact.role}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Ligar"
          className="flex size-9 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base"
        >
          <Phone size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Mais opções"
          className="flex size-9 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base"
        >
          <MoreVertical size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
