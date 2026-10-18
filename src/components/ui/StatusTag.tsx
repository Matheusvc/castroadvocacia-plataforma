import { InlineIcon } from "@/components/layout/InlineIcon";
import circleHelp from "@/assets/icon-circle-help.svg?raw";
import clock2 from "@/assets/icon-clock-2.svg?raw";
import circleCheckBig from "@/assets/icon-circle-check-big.svg?raw";
import type { ServiceStatus } from "@/types/entities";

interface StatusTagProps {
  status: ServiceStatus;
}

const config: Record<
  ServiceStatus,
  { label: string; icon: string; text: string; bg: string }
> = {
  open: {
    label: "Aberto",
    icon: circleHelp,
    text: "text-status-open",
    bg: "bg-status-open/20",
  },
  progress: {
    label: "Em atendimento",
    icon: clock2,
    text: "text-status-progress",
    bg: "bg-status-progress/20",
  },
  done: {
    label: "Encerrado",
    icon: circleCheckBig,
    text: "text-status-done",
    bg: "bg-status-done/20",
  },
};

/** Pílula de status (Figma — Serviços): ícone + rótulo, fundo translúcido. */
export function StatusTag({ status }: StatusTagProps) {
  const { label, icon, text, bg } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full p-1.5 ${bg} ${text}`}
    >
      <InlineIcon svg={icon} className="size-4 [&>svg]:size-4" />
      <span className="px-1.5 text-xs font-bold leading-[1.4]">{label}</span>
    </span>
  );
}
