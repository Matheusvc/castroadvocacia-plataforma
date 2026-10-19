import { useMemo, useState } from "react";
import { Download, PenLine, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { StatusTag } from "@/components/ui/StatusTag";
import { Avatar } from "@/components/layout/Avatar";
import {
  ServiceFormModal,
  type ServiceFormValues,
} from "@/components/servicos/ServiceFormModal";
import { usePersistentState } from "@/hooks/usePersistentState";
import { initialsFromName } from "@/lib/initials";
import { formatTotalDisplay } from "@/lib/currency";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_OPTIONS } from "@/lib/serviceStatus";
import { mockServices } from "@/data/mockServices";
import type { Service, ServiceStatus } from "@/types/entities";

type StatusFilter = "all" | ServiceStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Geral" },
  ...SERVICE_STATUS_OPTIONS,
];

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

/** Monta o CSV (com BOM, para acentuação correta no Excel) da lista de serviços. */
function buildServicesCsv(services: Service[]): string {
  const header = [
    "Id",
    "Atualizado em",
    "Título",
    "Serviço",
    "Valor total",
    "Responsável",
    "Status",
  ];
  const rows = services.map((s) => [
    s.id,
    s.updatedAt,
    s.title,
    s.service,
    formatTotalDisplay(s.total),
    s.owner.name,
    SERVICE_STATUS_LABELS[s.status],
  ]);
  const body = [header, ...rows]
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  return `﻿${body}`;
}

/** Data/hora atual no formato do Figma: dd/MM/aa HH:mm. */
function formatNow(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Próximo id sequencial no formato "00006". */
function nextServiceId(services: Service[]): string {
  const max = services.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0);
  return String(max + 1).padStart(5, "0");
}

/** Página Serviços: tabela de chamados com busca, criação e edição (persistida). */
export function ServicosPage() {
  const [services, setServices] = usePersistentState<Service[]>(
    "castro.services",
    mockServices,
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const counts = useMemo(() => {
    const c: Partial<Record<StatusFilter, number>> = { all: services.length };
    for (const s of services) c[s.status] = (c[s.status] ?? 0) + 1;
    return c;
  }, [services]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!q) return true;
      return [s.id, s.title, s.service, s.owner.name]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [services, query, statusFilter]);

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadText(
      `servicos-${stamp}.csv`,
      buildServicesCsv(filtered),
      "text/csv;charset=utf-8",
    );
  };

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setFormOpen(true);
  };

  const handleSave = (values: ServiceFormValues) => {
    const owner = {
      name: values.ownerName,
      initials: initialsFromName(values.ownerName),
    };
    if (editing) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? {
                ...s,
                title: values.title,
                service: values.service,
                total: values.total,
                owner,
                status: values.status,
                updatedAt: formatNow(),
              }
            : s,
        ),
      );
    } else {
      setServices((prev) => [
        {
          id: nextServiceId(prev),
          updatedAt: formatNow(),
          title: values.title,
          service: values.service,
          total: values.total,
          owner,
          status: values.status,
        },
        ...prev,
      ]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pb-6 pt-7 lg:px-12 lg:pb-12 lg:pt-[52px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Serviços" />
        <div className="flex items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            label="Buscar serviços"
            placeholder="Buscar por título, serviço ou responsável…"
          />
          <Button
            variant="secondary"
            onClick={handleExport}
            className="shrink-0"
            disabled={filtered.length === 0}
          >
            <Download size={16} aria-hidden="true" className="mr-1.5" />
            Exportar planilhas
          </Button>
          <Button onClick={openNew} className="shrink-0">
            <Plus size={16} aria-hidden="true" className="mr-1.5" />
            Novo
          </Button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Filtrar serviços por status"
        className="flex flex-wrap items-center gap-2"
      >
        {FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStatusFilter(f.value)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base focus-visible:ring-offset-1 ${
                active
                  ? "bg-blue-base text-gray-600"
                  : "border border-gray-500 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {f.label.toUpperCase()}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active ? "bg-gray-600/25" : "bg-gray-500 text-gray-400"
                }`}
              >
                {counts[f.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[920px] overflow-hidden rounded-[10px] border border-gray-500">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Lista de serviços e chamados</caption>
            <thead>
              <tr className="h-12 border-b border-gray-500">
                <th scope="col" className="w-[150px] whitespace-nowrap px-3 text-sm font-bold text-gray-400">
                  Atualizado em
                </th>
                <th scope="col" className="w-[72px] px-3 text-sm font-bold text-gray-400">
                  Id
                </th>
                <th scope="col" className="px-3 text-sm font-normal text-gray-400">
                  Planilhas
                </th>
                <th scope="col" className="w-[104px] px-3 text-sm font-bold text-gray-400">
                  Valor total
                </th>
                <th scope="col" className="w-[160px] px-3 text-sm font-normal text-gray-400">
                  Responsável
                </th>
                <th scope="col" className="w-[152px] px-3 text-sm font-bold text-gray-400">
                  Status
                </th>
                <th scope="col" className="w-[52px] px-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service) => (
                <tr
                  key={service.id}
                  className="h-16 border-b border-gray-500 transition-colors last:border-b-0 hover:bg-gray-600"
                >
                  <td className="whitespace-nowrap px-3 align-middle text-sm text-gray-200">
                    {service.updatedAt}
                  </td>
                  <td className="px-3 align-middle text-sm font-bold text-gray-200">
                    {service.id}
                  </td>
                  <td className="px-3 align-middle">
                    <span className="block truncate text-sm font-bold text-gray-200">
                      {service.title}
                    </span>
                    <span className="block truncate text-xs text-gray-200">
                      {service.service}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 align-middle text-sm font-bold tabular-nums text-gray-200">
                    {formatTotalDisplay(service.total)}
                  </td>
                  <td className="px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <Avatar initials={service.owner.initials} size="xxs" />
                      <span className="truncate text-sm text-gray-200">
                        {service.owner.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 align-middle">
                    <StatusTag status={service.status} />
                  </td>
                  <td className="px-3 align-middle">
                    <div className="flex justify-center">
                      <IconButton
                        label={`Editar serviço ${service.id}`}
                        onClick={() => openEdit(service)}
                      >
                        <PenLine size={14} aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-gray-400">
                    {query
                      ? `Nenhum serviço encontrado para “${query}”.`
                      : statusFilter !== "all"
                        ? "Nenhum serviço com esse status."
                        : "Nenhum serviço cadastrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceFormModal
        open={formOpen}
        service={editing}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
