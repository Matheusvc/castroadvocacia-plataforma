import { AlertCircle, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { MessageStatus } from "@/types/chat";

interface MessageStatusIconProps {
  status: MessageStatus;
}

const LABELS: Record<MessageStatus, string> = {
  sending: "Enviando",
  sent: "Enviada",
  error: "Falha ao enviar",
};

/** Cor por estado: envio neutro, entregue em azul, erro em vermelho. */
const TONES: Record<MessageStatus, string> = {
  sending: "text-gray-400",
  sent: "text-blue-base",
  error: "text-danger",
};

/** Ícone + rótulo acessível do status de uma mensagem enviada. */
export function MessageStatusIcon({ status }: MessageStatusIconProps) {
  const label = LABELS[status];
  return (
    <span
      className={cn("inline-flex items-center", TONES[status])}
      role="img"
      aria-label={label}
      title={label}
    >
      {status === "sending" && (
        <Clock size={14} className="animate-pulse" aria-hidden="true" />
      )}
      {status === "sent" && <CheckCheck size={14} aria-hidden="true" />}
      {status === "error" && <AlertCircle size={14} aria-hidden="true" />}
    </span>
  );
}
