import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Paperclip } from "lucide-react";
import { SendButton } from "./SendButton";

interface MessageInputProps {
  onSend: (text: string) => void;
  /** Envia uma imagem (data URL) escolhida pelo usuário. */
  onSendImage: (dataUrl: string) => void;
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
  onSendImage,
  placeholder = "Escreva uma mensagem…",
  disabled = false,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onSendImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onSendImage],
  );

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Enviar mensagem"
      className="shrink-0 border-t border-border-light bg-surface px-4 py-3 dark:border-night-border dark:bg-night-surface sm:px-6"
    >
      <div className="flex items-end gap-2">
        <label htmlFor={fieldId} className="sr-only">
          Mensagem
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Anexar imagem"
          title="Anexar imagem"
          className="flex size-11 shrink-0 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base disabled:opacity-60 dark:hover:bg-night-border/60 dark:hover:text-blue-light"
        >
          <Paperclip size={18} aria-hidden="true" />
        </button>
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
          className="scrollbar-slim max-h-[140px] min-h-[44px] flex-1 resize-none rounded-[14px] border border-border-light bg-gray-600 px-4 py-3 text-base leading-[1.4] text-gray-100 placeholder:text-gray-400 focus-visible:border-blue-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base/40 disabled:opacity-60 dark:border-night-border dark:bg-night-bg dark:text-night-text"
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
