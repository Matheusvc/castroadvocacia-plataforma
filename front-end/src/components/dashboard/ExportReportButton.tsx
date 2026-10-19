import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ReportData {
  dateLabel: string;
  clients: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    deltas: { total: number; active: number; inactive: number; pending: number };
  };
  services: {
    open: number;
    progress: number;
    done: number;
    analise: number;
    pendente: number;
    total: number;
  };
}

const pct = (value: number, total: number) =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : "0%";

const signed = (n: number) => `${n >= 0 ? "+" : ""}${n}`;

/** Gera e baixa um arquivo a partir de texto. */
function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildCsv(d: ReportData): string {
  const { clients: c, services: s } = d;
  const rows: string[][] = [
    ["Relatório do Dashboard — Castro Advocacia"],
    ["Gerado em", new Date().toLocaleString("pt-BR")],
    [],
    ["Indicador", "Valor", "Variação (%)"],
    ["Total de clientes", String(c.total), signed(c.deltas.total)],
    ["Ativos", String(c.active), signed(c.deltas.active)],
    ["Inativos", String(c.inactive), signed(c.deltas.inactive)],
    ["Pendentes", String(c.pending), signed(c.deltas.pending)],
    [],
    ["Status dos clientes", "Quantidade", "Percentual"],
    ["Ativos", String(c.active), pct(c.active, c.total)],
    ["Inativos", String(c.inactive), pct(c.inactive, c.total)],
    ["Pendentes", String(c.pending), pct(c.pending, c.total)],
    [],
    ["Processos por status", "Quantidade", "Percentual"],
    ["Aberto", String(s.open), pct(s.open, s.total)],
    ["Em análise", String(s.analise), pct(s.analise, s.total)],
    ["Em atendimento", String(s.progress), pct(s.progress, s.total)],
    ["Concluído", String(s.done), pct(s.done, s.total)],
    ["Pendente", String(s.pendente), pct(s.pendente, s.total)],
  ];
  const body = rows
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  // BOM para acentuação correta no Excel.
  return `﻿${body}`;
}

function buildReportHtml(d: ReportData): string {
  const { clients: c, services: s } = d;
  const row = (label: string, value: string | number, extra: string) =>
    `<tr><td>${label}</td><td class="num">${value}</td><td class="num muted">${extra}</td></tr>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Relatório do Dashboard — Castro Advocacia</title>
<style>
  :root{color-scheme:light}
  *{box-sizing:border-box}
  body{font-family:"Lato","Segoe UI",Roboto,sans-serif;color:#151619;margin:40px;}
  header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #2e3da3;padding-bottom:16px;margin-bottom:24px;}
  .brand{font-size:20px;font-weight:700;color:#2e3da3}
  .brand small{display:block;font-size:10px;letter-spacing:1px;color:#8996eb}
  h1{font-size:18px;margin:0 0 2px}
  .sub{color:#858b99;font-size:12px}
  h2{font-size:13px;color:#2e3da3;margin:24px 0 8px;text-transform:uppercase;letter-spacing:.5px}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
  .kpi{border:1px solid #e3e5e8;border-radius:8px;padding:12px}
  .kpi .l{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#858b99}
  .kpi .v{font-size:24px;font-weight:700;margin-top:4px}
  .kpi .d{font-size:11px;font-weight:700}
  .up{color:#508b26}.down{color:#d03e3e}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #e3e5e8}
  th{color:#858b99;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
  td.num{text-align:right}.muted{color:#858b99}
  footer{margin-top:32px;color:#858b99;font-size:11px;border-top:1px solid #e3e5e8;padding-top:12px}
  @media print{body{margin:16mm}}
</style></head>
<body>
  <header>
    <div><h1>Relatório do Dashboard</h1><div class="sub">Visão geral do escritório · ${d.dateLabel}</div></div>
    <div class="brand">CASTRO<small>ADVOCACIA</small></div>
  </header>

  <section class="kpis">
    <div class="kpi"><div class="l">Total de clientes</div><div class="v">${c.total}</div><div class="d ${c.deltas.total >= 0 ? "up" : "down"}">${signed(c.deltas.total)}% vs. mês ant.</div></div>
    <div class="kpi"><div class="l">Ativos</div><div class="v">${c.active}</div><div class="d ${c.deltas.active >= 0 ? "up" : "down"}">${signed(c.deltas.active)}% vs. mês ant.</div></div>
    <div class="kpi"><div class="l">Inativos</div><div class="v">${c.inactive}</div><div class="d ${c.deltas.inactive <= 0 ? "up" : "down"}">${signed(c.deltas.inactive)}% vs. mês ant.</div></div>
    <div class="kpi"><div class="l">Pendentes</div><div class="v">${c.pending}</div><div class="d ${c.deltas.pending <= 0 ? "up" : "down"}">${signed(c.deltas.pending)}% vs. mês ant.</div></div>
  </section>

  <h2>Status dos clientes</h2>
  <table><thead><tr><th>Status</th><th class="num">Quantidade</th><th class="num">Percentual</th></tr></thead><tbody>
    ${row("Ativos", c.active, pct(c.active, c.total))}
    ${row("Inativos", c.inactive, pct(c.inactive, c.total))}
    ${row("Pendentes", c.pending, pct(c.pending, c.total))}
  </tbody></table>

  <h2>Processos por status</h2>
  <table><thead><tr><th>Status</th><th class="num">Quantidade</th><th class="num">Percentual</th></tr></thead><tbody>
    ${row("Aberto", s.open, pct(s.open, s.total))}
    ${row("Em análise", s.analise, pct(s.analise, s.total))}
    ${row("Em atendimento", s.progress, pct(s.progress, s.total))}
    ${row("Concluído", s.done, pct(s.done, s.total))}
    ${row("Pendente", s.pendente, pct(s.pendente, s.total))}
  </tbody></table>

  <footer>Gerado em ${new Date().toLocaleString("pt-BR")} · Castro Advocacia</footer>
</body></html>`;
}

/** Imprime o relatório via iframe oculto (evita bloqueio de popup). */
function printReport(d: ReportData) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(buildReportHtml(d));
  doc.close();
  const win = iframe.contentWindow;
  const cleanup = () => window.setTimeout(() => iframe.remove(), 1000);
  if (win) {
    win.onafterprint = cleanup;
    window.setTimeout(() => {
      win.focus();
      win.print();
      cleanup();
    }, 250);
  } else {
    cleanup();
  }
}

interface ExportReportButtonProps {
  data: ReportData;
}

/** Botão "Exportar relatório" com menu (PDF/impressão e CSV). */
export function ExportReportButton({ data }: ExportReportButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const handlePrint = () => {
    close();
    printReport(data);
  };

  const handleCsv = () => {
    close();
    const stamp = new Date().toISOString().slice(0, 10);
    downloadText(
      `relatorio-dashboard-${stamp}.csv`,
      buildCsv(data),
      "text/csv;charset=utf-8",
    );
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-sm bg-blue-base px-4 text-sm font-bold text-gray-600 transition-colors hover:bg-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base focus-visible:ring-offset-2"
      >
        <Download size={16} aria-hidden="true" />
        Exportar relatório
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Opções de exportação"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-gray-500 bg-surface py-1 shadow-card-hover"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handlePrint}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-200 transition-colors hover:bg-gray-600 focus-visible:bg-gray-600 focus-visible:outline-none"
          >
            <Printer size={16} aria-hidden="true" className="text-gray-400" />
            Imprimir / Salvar PDF
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleCsv}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-200 transition-colors",
              "hover:bg-gray-600 focus-visible:bg-gray-600 focus-visible:outline-none",
            )}
          >
            <FileSpreadsheet size={16} aria-hidden="true" className="text-gray-400" />
            Baixar CSV
          </button>
        </div>
      )}
    </div>
  );
}
