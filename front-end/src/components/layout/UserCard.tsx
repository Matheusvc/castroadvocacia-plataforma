import { LogOut } from "lucide-react";
import { Avatar } from "./Avatar";

interface UserCardProps {
  name: string;
  email: string;
  initials: string;
  onLogout?: () => void;
}

/** Bloco de usuário no rodapé da sidebar (Figma). */
export function UserCard({ name, email, initials, onLogout }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 border-t border-gray-200 px-4 py-5 dark:border-night-border">
      <Avatar initials={initials} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm text-gray-600">{name}</span>
        <span className="truncate text-xs text-gray-400">{email}</span>
      </div>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          aria-label="Sair"
          title="Sair"
          className="flex size-8 shrink-0 items-center justify-center rounded-sm text-fuschia-60 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:hover:bg-night-border/60"
        >
          <LogOut size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
