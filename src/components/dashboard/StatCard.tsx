import type { ReactNode } from "react";
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
}: StatCardProps) {
  const hasDelta = typeof delta === "number";
  const up = (delta ?? 0) >= 0;
  const isGood = up ? !invert : invert;

  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-gray-500/70 bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.6px] text-gray-400">
          {label}
        </span>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            accentBg,
            accent,
          )}
        >
          {icon}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-bold leading-none tabular-nums text-gray-100">
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
