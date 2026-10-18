import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { SendButton } from "./SendButton";

interface MessageInputProps {
  onSend: (text: string) => void;
  /** Texto de placeholder. */
  placeholder?: string;
  disabled?: boolean;
}

const MAX_HEIGHT = 140; // px — altura máxima antes de rolar o textarea

/**
 * Campo de envio: textarea auto-expansível.
 * - Enter envia; Shift+Enter quebra linha.
 */
export function MessageInput({
  onSend,
  placeholder = "Escreva uma mensagem…",
  disabled = false,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
  const hintId = useId();

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !disabled;

  // Auto-resize do textarea.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const submit = useCallback(() => {
    if (!canSend) return;
    onSend(trimmed);
    setValue("");
    // Devolve o foco ao campo após enviar.
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [canSend, onSend, trimmed]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      submit();
    },
    [submit],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Enviar mensagem"
      className="shrink-0 border-t border-border-light bg-surface px-4 py-3 sm:px-6"
    >
      <div className="flex items-end gap-2">
        <label htmlFor={fieldId} className="sr-only">
          Mensagem
        </label>
        <textarea
          id={fieldId}
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-describedby={hintId}
          className="scrollbar-slim max-h-[140px] min-h-[44px] flex-1 resize-none rounded-[14px] border border-border-light bg-gray-600 px-4 py-3 text-base leading-[1.4] text-gray-100 placeholder:text-gray-400 focus-visible:border-blue-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base/40 disabled:opacity-60"
        />
        <SendButton disabled={!canSend} />
      </div>
      <p id={hintId} className="mt-1.5 px-1 text-xs text-gray-400">
        <kbd className="font-sans font-bold">Enter</kbd> envia ·{" "}
        <kbd className="font-sans font-bold">Shift</kbd> +{" "}
        <kbd className="font-sans font-bold">Enter</kbd> quebra linha
      </p>
    </form>
  );
}
