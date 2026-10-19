import { useState, type FormEvent } from "react";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

interface LoginPageProps {
  onLogin: () => void;
}

/** Página de login (fundo claro) — valida e-mail/senha e autentica. */
export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Informe um e-mail válido.";
    }

    if (!password) {
      nextErrors.password = "Informe sua senha.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onLogin();
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-gray-600 px-4">
      <div className="w-full max-w-sm rounded-content border border-border-light bg-surface p-8 shadow-card">
        <div className="mb-8 flex items-center gap-3">
          <img src="/assets/logo.svg" alt="Castro Advocacia" width={44} height={44} className="shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg text-gray-100">CASTRO</span>
            <span className="font-bold text-xxs uppercase tracking-[0.6px] text-blue-light">
              ADVOCACIA
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
            required
            error={errors.email}
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
            error={errors.password}
          />
          <Button type="submit" variant="primary" className="mt-2 w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
