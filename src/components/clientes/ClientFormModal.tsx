import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import type { Client } from "@/types/entities";

/** Valores editáveis de um cliente. */
export interface ClientFormValues {
  name: string;
  cpf: string;
  processNumber: string;
}

interface ClientFormModalProps {
  open: boolean;
  /** Cliente em edição; `null` cria um novo. */
  client: Client | null;
  onSave: (values: ClientFormValues) => void;
  onClose: () => void;
}

/** Formulário de criação/edição de cliente. */
export function ClientFormModal({
  open,
  client,
  onSave,
  onClose,
}: ClientFormModalProps) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [processNumber, setProcessNumber] = useState("");

  // Carrega (edição) ou limpa (novo) os campos ao abrir.
  useEffect(() => {
    if (!open) return;
    setName(client?.name ?? "");
    setCpf(client?.cpf ?? "");
    setProcessNumber(client?.processNumber ?? "");
  }, [open, client]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onSave({
      name: trimmedName,
      cpf: cpf.trim(),
      processNumber: processNumber.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={client ? "Editar cliente" : "Novo cliente"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Nome" value={name} onChange={setName} required />
        <TextField
          label="CPF"
          value={cpf}
          onChange={setCpf}
          placeholder="000.000.000-00"
        />
        <TextField
          label="Número do processo"
          value={processNumber}
          onChange={setProcessNumber}
          placeholder="0000000-00.0000.0.00.0000"
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{client ? "Salvar" : "Criar"}</Button>
        </div>
      </form>
    </Modal>
  );
}
