export interface DonutSegment {
  label: string;
  value: number;
  /** Cor do segmento (hex). */
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerValue: number | string;
  centerLabel: string;
  /** Rótulo acessível do gráfico como um todo. */
  ariaLabel: string;
}

const SIZE = 200;
const STROKE = 26;
const R = (SIZE - STROKE) / 2;
const CX = SIZE / 2;
const GAP = 1.5; // folga (em %) entre segmentos — separação visual (2px surface gap)

/**
 * Donut (SVG) para distribuição de status. Identidade por cor + rótulo direto
 * na legenda (nunca só por cor). Tooltip nativo por segmento via <title>.
 */
export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  ariaLabel,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let acc = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={ariaLabel}
        >
          {/* trilho */}
          <circle
            cx={CX}
            cy={CX}
            r={R}
            fill="none"
            stroke="var(--c-border-light)"
            strokeWidth={STROKE}
          />
          {segments.map((s) => {
            const pct = (s.value / total) * 100;
            const dash = Math.max(pct - GAP, 0.5);
            const offset = acc;
            acc += pct;
            return (
              <circle
                key={s.label}
                cx={CX}
                cy={CX}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                pathLength={100}
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${CX} ${CX})`}
              >
                <title>{`${s.label}: ${s.value} (${Math.round(pct)}%)`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold leading-none text-gray-100">
            {centerValue}
          </span>
          <span className="text-xs text-gray-400">{centerLabel}</span>
        </div>
      </div>

      {/* Legenda = codificação secundária (rótulo + valor) */}
      <ul className="flex w-full flex-col gap-2">
        {segments.map((s) => {
          const pct = Math.round((s.value / total) * 100);
          return (
            <li key={s.label} className="flex items-center gap-2 text-sm">
              <span
                className="size-3 shrink-0 rounded-sm"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-gray-200">{s.label}</span>
              <span className="font-bold text-gray-100">{s.value}</span>
              <span className="w-10 text-right text-gray-400">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
