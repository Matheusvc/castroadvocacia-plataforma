import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

/**
 * Visualizador de imagem em tela cheia (estilo WhatsApp: toca na foto para
 * ampliar). Fecha com Esc, clique fora ou no botão de fechar.
 */
export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
    >
      <button
        type="button"
        aria-label="Fechar imagem"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-gray-600 transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base"
      >
        <X size={20} aria-hidden="true" />
      </button>
      <img
        src={src}
        alt={alt}
        className="relative z-0 min-h-[160px] min-w-[160px] max-h-[90vh] max-w-full rounded-lg object-contain"
      />
    </div>
  );
}
