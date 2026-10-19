/** Tipos do domínio de chat. */

/** Quem enviou a mensagem. `me` = usuário atual (balão à direita). */
export type MessageAuthor = "me" | "them";

/** Status de entrega de uma mensagem enviada por `me`. */
export type MessageStatus = "sending" | "sent" | "error";

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  /** Texto da mensagem. Ausente/vazio em mensagens que são só imagem. */
  text?: string;
  /** Imagem anexada (data URL ou URL remota). */
  image?: string;
  /** Timestamp em epoch ms. */
  createdAt: number;
  /** Presente apenas em mensagens de `me`. */
  status?: MessageStatus;
}

/** Contato/conversa exibido no cabeçalho do chat. */
export interface ChatContact {
  name: string;
  /** Iniciais usadas no avatar quando não há imagem. */
  initials: string;
  role?: string;
  online: boolean;
  /** Telefone formatado (ex.: "(11) 98765-4321"). */
  phone: string;
  /** Recado/descrição curta exibida no perfil (estilo "recado" do WhatsApp). */
  about?: string;
}

/** Uma conversa na fila de atendimento ("Falar com o atendente"). */
export interface Conversation {
  id: string;
  contact: ChatContact;
  /** Prévia da última mensagem (lista de conversas). */
  lastMessage: string;
  /** Epoch ms da última mensagem. */
  lastTime: number;
  /** Mensagens não lidas. */
  unread: number;
  /** Histórico da conversa. */
  messages: ChatMessage[];
}
