import { Send } from "lucide-react";
import { cn } from "@/lib/cn";

interface SendButtonProps {
  disabled?: boolean;
}

/** Botão de envio (blue/base). Desabilitado quando não há texto. */
export function SendButton({ disabled }: SendButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label="Enviar mensagem"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-sm text-gray-600 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base focus-visible:ring-offset-2",
        disabled
          ? "cursor-not-allowed bg-blue-light/50"
          : "bg-blue-base hover:bg-blue-dark active:bg-blue-dark",
      )}
    >
      <Send size={18} aria-hidden="true" />
    </button>
  );
}
