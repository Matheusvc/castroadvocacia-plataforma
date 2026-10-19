import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  required?: boolean;
  placeholder?: string;
  /** Dica de teclado virtual (ex.: "numeric" para campos de valor). */
  inputMode?: "text" | "numeric" | "decimal";
  error?: string;
}

/** Campo de texto rotulado para formulários. */
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  inputMode,
  error,
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-gray-200 dark:text-night-text">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          inputMode={inputMode}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-10 w-full rounded-sm border bg-surface px-3 text-sm text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 dark:bg-night-surface dark:text-night-text ${
            isPassword ? "pr-10" : ""
          } ${
            error
              ? "border-danger focus-visible:border-danger focus-visible:ring-danger/30"
              : "border-gray-500 focus-visible:border-blue-base focus-visible:ring-blue-base/30 dark:border-night-border"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-400 hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:text-night-text"
          >
            {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && (
        <span id={errorId} className="text-sm text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
