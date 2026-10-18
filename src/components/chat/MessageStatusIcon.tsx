import { AlertCircle, CheckCheck, Clock } from "lucide-react";
import type { MessageStatus } from "@/types/chat";

interface MessageStatusIconProps {
  status: MessageStatus;
}

const LABELS: Record<MessageStatus, string> = {
  sending: "Enviando",
  sent: "Enviada",
  error: "Falha ao enviar",
};

/** Ícone + rótulo acessível do status de uma mensagem enviada. */
export function MessageStatusIcon({ status }: MessageStatusIconProps) {
  const label = LABELS[status];
  return (
    <span
      className="inline-flex items-center"
      role="img"
      aria-label={label}
      title={label}
    >
      {status === "sending" && <Clock size={14} aria-hidden="true" />}
      {status === "sent" && <CheckCheck size={14} aria-hidden="true" />}
      {status === "error" && (
        <AlertCircle size={14} className="text-danger" aria-hidden="true" />
      )}
    </span>
  );
}
