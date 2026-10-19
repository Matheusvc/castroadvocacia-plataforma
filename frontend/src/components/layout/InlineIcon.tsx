import { cn } from "@/lib/cn";

interface InlineIconProps {
  /** Conteúdo SVG bruto (importado com `?raw`). Usa fill="currentColor". */
  svg: string;
  className?: string;
}

/**
 * Renderiza um SVG inline para que `currentColor` herde a cor do texto
 * (permite recolorir por estado sem perder a geometria original do Figma).
 */
export function InlineIcon({ svg, className }: InlineIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
