import { useMemo, useState } from "react";
import { PenLine, Plus } from "lucide-react";
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
import { mockServices } from "@/data/mockServices";
import type { Service } from "@/types/entities";

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
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      [s.id, s.title, s.service, s.owner.name].join(" ").toLowerCase().includes(q),
    );
  }, [services, query]);

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
          <Button onClick={openNew} className="shrink-0">
            <Plus size={16} aria-hidden="true" className="mr-1.5" />
            Novo
          </Button>
        </div>
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
                  className="h-16 border-b border-gray-500 last:border-b-0"
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
                  <td className="px-3 align-middle text-sm text-gray-200">
                    {service.total}
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
