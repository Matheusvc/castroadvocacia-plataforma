export interface BarDatum {
  label: string;
  value: number;
  /** Cor da barra (hex). */
  color: string;
}

interface StatusBarChartProps {
  data: BarDatum[];
  ariaLabel: string;
}

/**
 * Barras horizontais (status de serviços). Rótulo, valor e % diretos em cada
 * barra (identidade nunca só por cor); extremidade arredondada, barra fina.
 */
export function StatusBarChart({ data, ariaLabel }: StatusBarChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ul className="flex flex-col gap-4" role="img" aria-label={ariaLabel}>
      {data.map((d) => {
        const pct = Math.round((d.value / total) * 100);
        return (
          <li key={d.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-gray-200 dark:text-night-text">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: d.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{d.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-gray-400">
                <span className="font-bold text-gray-100 dark:text-night-text">{d.value}</span> · {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border-light dark:bg-night-border">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  backgroundColor: d.color,
                  minWidth: d.value > 0 ? "0.5rem" : 0,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
