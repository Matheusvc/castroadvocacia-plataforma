import type { CSSProperties, ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  /** Cor do chip do ícone (classe de texto, ex.: "text-status-done"). */
  accent?: string;
  /** Fundo do chip (ex.: "bg-status-done/15"). */
  accentBg?: string;
  /** Variação percentual vs. período anterior. */
  delta?: number;
  /** Quando true, uma variação positiva é considerada negativa (ex.: inativos). */
  invert?: boolean;
  /** Classes extras (ex.: animação de entrada aplicada pela página). */
  className?: string;
  /** Estilos inline extras (ex.: animation-delay para efeito escalonado). */
  style?: CSSProperties;
}

/** Cartão de indicador (KPI) do Dashboard, com tendência. */
export function StatCard({
  label,
  value,
  icon,
  accent = "text-blue-dark",
  accentBg = "bg-blue-base/10",
  delta,
  invert = false,
  className,
  style,
}: StatCardProps) {
  const hasDelta = typeof delta === "number";
  const up = (delta ?? 0) >= 0;
  const isGood = up ? !invert : invert;

  return (
    <article
      style={style}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-gray-500/70 bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-base/30 hover:shadow-card-hover dark:border-night-border dark:bg-night-surface dark:shadow-none",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.6px] text-gray-400">
          {label}
        </span>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110",
            accentBg,
            accent,
          )}
        >
          {icon}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold leading-none tabular-nums text-gray-100 dark:text-night-text">
          {value}
        </span>
        {hasDelta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-bold",
              isGood ? "bg-status-done/10 text-status-done" : "bg-danger/10 text-danger",
            )}
            title="vs. mês anterior"
          >
            {up ? (
              <ArrowUpRight size={13} aria-hidden="true" />
            ) : (
              <ArrowDownRight size={13} aria-hidden="true" />
            )}
            {`${up ? "+" : ""}${delta}%`}
          </span>
        )}
      </div>

      {hasDelta && (
        <span className="text-xs text-gray-400">vs. mês anterior</span>
      )}
    </article>
  );
}
