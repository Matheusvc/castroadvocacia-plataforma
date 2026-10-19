import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Diálogo modal acessível: role="dialog", aria-modal, fecha com Esc/clique-fora,
 * bloqueia o scroll, move o foco para dentro e devolve ao elemento anterior.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap de foco dentro do painel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Foca o primeiro campo do painel ao abrir.
    const t = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'input, select, textarea, button',
      );
      focusable?.focus();
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="relative z-10 flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-[16px] bg-surface shadow-2xl animate-fade-in-up dark:bg-night-surface sm:max-w-md sm:rounded-[16px]"
      >
        <header className="flex items-center justify-between border-b border-border-light px-5 py-4 dark:border-night-border">
          <h2 id={titleId} className="text-base font-bold text-gray-100 dark:text-night-text">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-8 items-center justify-center rounded-sm text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60 dark:hover:text-night-text"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className="scrollbar-slim min-h-0 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
