import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, MoreVertical, Phone } from "lucide-react";
import type { ChatContact } from "@/types/chat";
import { Avatar } from "@/components/layout/Avatar";
import { ContactProfileModal } from "./ContactProfileModal";

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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const phoneHref = `tel:${contact.phone.replace(/\D/g, "")}`;

  // Ao abrir/trocar de conversa, leva o foco ao título para orientar leitores de
  // tela (o ChatPanel remonta por conversa via `key`, então isto roda a cada troca).
  useEffect(() => {
    titleRef.current?.focus();
  }, [contact.name]);

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border-light bg-surface px-4 py-4 dark:border-night-border dark:bg-night-surface sm:px-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para a lista de conversas"
          className="flex size-9 shrink-0 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60 dark:hover:text-blue-light lg:hidden"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        onClick={() => setProfileOpen(true)}
        aria-label={`Ver perfil de ${contact.name}`}
        title={`Ver perfil de ${contact.name}`}
        className="group flex min-w-0 flex-1 items-center gap-3 rounded-sm px-1.5 py-1 -mx-1.5 text-left transition-colors hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60"
      >
        <Avatar initials={contact.initials} size="md" online={contact.online} />

        <div className="flex min-w-0 flex-1 flex-col">
          <h1
            ref={titleRef}
            tabIndex={-1}
            className="truncate text-lg font-bold leading-[1.4] text-blue-dark outline-none dark:text-blue-light lg:text-xl"
          >
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

        <ChevronRight
          size={18}
          aria-hidden="true"
          className="shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </button>

      <div className="flex items-center gap-1">
        <a
          href={phoneHref}
          aria-label={`Ligar para ${contact.name}`}
          title={contact.phone}
          className="flex size-9 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60 dark:hover:text-blue-light"
        >
          <Phone size={18} aria-hidden="true" />
        </a>
        <button
          type="button"
          aria-label="Mais opções"
          className="flex size-9 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60 dark:hover:text-blue-light"
        >
          <MoreVertical size={18} aria-hidden="true" />
        </button>
      </div>

      <ContactProfileModal
        open={profileOpen}
        contact={contact}
        onClose={() => setProfileOpen(false)}
      />
    </header>
  );
}
