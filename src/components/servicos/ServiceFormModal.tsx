import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { maskCurrencyInput } from "@/lib/currency";
import { SERVICE_STATUS_OPTIONS } from "@/lib/serviceStatus";
import type { Service, ServiceStatus } from "@/types/entities";

/** Valores editáveis de um serviço. */
export interface ServiceFormValues {
  title: string;
  service: string;
  total: string;
  ownerName: string;
  status: ServiceStatus;
}

interface ServiceFormModalProps {
  open: boolean;
  /** Serviço em edição; `null` cria um novo. */
  service: Service | null;
  onSave: (values: ServiceFormValues) => void;
  onClose: () => void;
}

const statusOptions = SERVICE_STATUS_OPTIONS;

/** Formulário de criação/edição de serviço. */
export function ServiceFormModal({
  open,
  service,
  onSave,
  onClose,
}: ServiceFormModalProps) {
  const [title, setTitle] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [total, setTotal] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState<ServiceStatus>("open");

  useEffect(() => {
    if (!open) return;
    setTitle(service?.title ?? "");
    setServiceName(service?.service ?? "");
    setTotal(maskCurrencyInput(service?.total ?? ""));
    setOwner(service?.owner.name ?? "");
    setStatus(service?.status ?? "open");
  }, [open, service]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSave({
      title: trimmedTitle,
      service: serviceName.trim(),
      total: total.trim(),
      ownerName: owner.trim(),
      status,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={service ? `Editar serviço ${service.id}` : "Novo serviço"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Título" value={title} onChange={setTitle} required />
        <TextField label="Serviço" value={serviceName} onChange={setServiceName} />
        <TextField
          label="Valor total"
          value={total}
          onChange={(v) => setTotal(maskCurrencyInput(v))}
          inputMode="numeric"
          placeholder="R$ 0,00"
        />
        <TextField label="Responsável" value={owner} onChange={setOwner} />
        <SelectField
          label="Status"
          value={status}
          onChange={(v) => setStatus(v as ServiceStatus)}
          options={statusOptions}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{service ? "Salvar" : "Criar"}</Button>
        </div>
      </form>
    </Modal>
  );
}
