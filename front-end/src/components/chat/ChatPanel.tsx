import { useChat } from "@/hooks/useChat";
import type { ChatContact, ChatMessage } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatPanelProps {
  contact: ChatContact;
  initialMessages: ChatMessage[];
  /** Exibe o botão "voltar" no cabeçalho (mobile). */
  onBack?: () => void;
}

/**
 * Painel de chat completo (cabeçalho + lista + input) para uma conversa.
 */
export function ChatPanel({ contact, initialMessages, onBack }: ChatPanelProps) {
  const { messages, isTyping, sendMessage, retryMessage } = useChat(initialMessages);

  return (
    <section
      aria-label={`Conversa com ${contact.name}`}
      className="flex min-h-0 flex-1 flex-col"
    >
      <ChatHeader contact={contact} onBack={onBack} />
      <MessageList
        messages={messages}
        isTyping={isTyping}
        contactName={contact.name}
        contactInitials={contact.initials}
        onRetry={retryMessage}
      />
      <MessageInput onSend={sendMessage} />
    </section>
  );
}
