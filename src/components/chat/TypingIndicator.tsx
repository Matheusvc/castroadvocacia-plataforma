import { Avatar } from "@/components/layout/Avatar";

interface TypingIndicatorProps {
  contactInitials: string;
  contactName: string;
}

/** "Digitando…" com três pontos animados, no estilo de um balão recebido. */
export function TypingIndicator({
  contactInitials,
  contactName,
}: TypingIndicatorProps) {
  return (
    <li className="flex items-end gap-2" aria-label={`${contactName} está digitando`}>
      <Avatar initials={contactInitials} size="sm" />
      <div className="flex items-center gap-1 rounded-bubble rounded-tl-[4px] border border-border-light bg-bubble-received px-4 py-3 shadow-sm">
        <span className="size-2 animate-typing-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
        <span className="size-2 animate-typing-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
        <span className="size-2 animate-typing-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
      </div>
    </li>
  );
}
