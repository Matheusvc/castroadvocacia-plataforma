export interface ProcessSegment {
  label: string;
  value: number;
  /** Cor do segmento (hex). */
  color: string;
}

interface ProcessStatusChartProps {
  segments: ProcessSegment[];
  /** Rótulo acessível do gráfico como um todo. */
  ariaLabel: string;
}

/**
 * Composição de processos por status em uma única barra segmentada
 * (identidade sempre por rótulo + cor, nunca só por cor — legenda abaixo
 * carrega rótulo, valor e %; tooltip nativo por segmento).
 */
export function ProcessStatusChart({ segments, ariaLabel }: ProcessStatusChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex h-4 w-full gap-[2px] overflow-hidden rounded-full bg-surface"
        role="img"
        aria-label={ariaLabel}
      >
        {segments.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <div
              key={s.label}
              style={{ flexGrow: s.value, flexBasis: 0, backgroundColor: s.color }}
              title={`${s.label}: ${s.value} (${pct}%)`}
            />
          );
        })}
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {segments.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <li key={s.label} className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-gray-400">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: s.color }}
                  aria-hidden="true"
                />
                {s.label}
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold leading-none tabular-nums text-gray-100">
                  {s.value}
                </span>
                <span className="text-xs text-gray-400">{pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
