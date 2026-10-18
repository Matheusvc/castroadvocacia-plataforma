import { cn } from "@/lib/cn";

interface TimestampProps {
  value: number;
  className?: string;
}

const timeFmt = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

const fullFmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

/** Hora da mensagem (HH:MM), com data completa no title/<time>. */
export function Timestamp({ value, className }: TimestampProps) {
  const date = new Date(value);
  return (
    <time
      dateTime={date.toISOString()}
      title={fullFmt.format(date)}
      className={cn("text-xs tabular-nums", className)}
    >
      {timeFmt.format(date)}
    </time>
  );
}
