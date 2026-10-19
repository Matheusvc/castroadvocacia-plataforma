import { Search } from "lucide-react";
import { InlineIcon } from "@/components/layout/InlineIcon";
import circleHelp from "@/assets/icon-circle-help.svg?raw";
import clock2 from "@/assets/icon-clock-2.svg?raw";
import circleCheckBig from "@/assets/icon-circle-check-big.svg?raw";
import { SERVICE_STATUS_LABELS } from "@/lib/serviceStatus";
import type { ServiceStatus } from "@/types/entities";

interface StatusTagProps {
  status: ServiceStatus;
}

const config: Record<
  ServiceStatus,
  { text: string; bg: string; icon: () => React.ReactNode }
> = {
  open: {
    text: "text-status-open",
    bg: "bg-status-open/20",
    icon: () => <InlineIcon svg={circleHelp} className="size-4 [&>svg]:size-4" />,
  },
  progress: {
    text: "text-status-progress",
    bg: "bg-status-progress/20",
    icon: () => <InlineIcon svg={clock2} className="size-4 [&>svg]:size-4" />,
  },
  done: {
    text: "text-status-done",
    bg: "bg-status-done/20",
    icon: () => <InlineIcon svg={circleCheckBig} className="size-4 [&>svg]:size-4" />,
  },
  analise: {
    text: "text-status-analise",
    bg: "bg-status-analise/20",
    icon: () => <Search size={16} aria-hidden="true" className="shrink-0" />,
  },
};

/** Pílula de status (Figma — Serviços): ícone + rótulo, fundo translúcido. */
export function StatusTag({ status }: StatusTagProps) {
  const { text, bg, icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full p-1.5 ring-1 ring-inset ring-current/20 ${bg} ${text}`}
    >
      {icon()}
      <span className="px-1.5 text-xs font-bold leading-[1.4]">
        {SERVICE_STATUS_LABELS[status]}
      </span>
    </span>
  );
}
