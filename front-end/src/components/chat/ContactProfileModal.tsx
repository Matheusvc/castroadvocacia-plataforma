import { useState } from "react";
import { Check, Copy, Phone } from "lucide-react";
import type { ChatContact } from "@/types/chat";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/layout/Avatar";

interface ContactProfileModalProps {
  open: boolean;
  contact: ChatContact;
  onClose: () => void;
}

/** Painel de informações do contato (nome, status e telefone). */
export function ContactProfileModal({
  open,
  contact,
  onClose,
}: ContactProfileModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sem permissão/clipboard indisponível: ignora silenciosamente.
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Perfil do contato">
      <div className="flex flex-col items-center gap-3 pb-2 text-center">
        <Avatar initials={contact.initials} size="md" online={contact.online} />
        <div>
          <p className="text-lg font-bold text-gray-100 dark:text-night-text">{contact.name}</p>
          <p className="text-sm text-gray-400">
            {contact.online ? "Online agora" : "Offline"}
            {contact.role ? ` · ${contact.role}` : ""}
          </p>
        </div>
      </div>

      {contact.about && (
        <div className="mt-4 flex flex-col gap-1.5 rounded-lg border border-border-light p-4 dark:border-night-border">
          <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Recado
          </span>
          <p className="text-base text-gray-100 dark:text-night-text">{contact.about}</p>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-1.5 rounded-lg border border-border-light p-4 dark:border-night-border">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Telefone
        </span>
        <div className="flex items-center justify-between gap-3">
          <a
            href={`tel:${contact.phone.replace(/\D/g, "")}`}
            className="truncate text-base text-gray-100 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:text-night-text"
          >
            {contact.phone}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copiar número de telefone"
            title="Copiar número"
            className="flex size-8 shrink-0 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60 dark:hover:text-blue-light"
          >
            {copied ? (
              <Check size={16} aria-hidden="true" className="text-emerald-600" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <a
        href={`tel:${contact.phone.replace(/\D/g, "")}`}
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-blue-base text-sm font-bold text-gray-600 transition-colors hover:bg-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base focus-visible:ring-offset-2"
      >
        <Phone size={16} aria-hidden="true" />
        Ligar
      </a>
    </Modal>
  );
}
