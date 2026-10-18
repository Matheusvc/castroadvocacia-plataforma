import { Avatar } from "./Avatar";

interface UserCardProps {
  name: string;
  email: string;
  initials: string;
}

/** Bloco de usuário no rodapé da sidebar (Figma). */
export function UserCard({ name, email, initials }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 border-t border-gray-200 px-4 py-5">
      <Avatar initials={initials} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm text-gray-600">{name}</span>
        <span className="truncate text-xs text-gray-400">{email}</span>
      </div>
    </div>
  );
}
