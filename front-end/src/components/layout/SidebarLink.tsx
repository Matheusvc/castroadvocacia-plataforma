import { cn } from "@/lib/cn";
import type { NavItem } from "./navItems";

interface SidebarLinkProps {
  item: NavItem;
  active: boolean;
  onSelect: (id: string) => void;
}

/**
 * Link de menu da sidebar.
 * - Ativo: bg blue/dark, texto/ícone gray-600 (branco).
 * - Inativo: texto/ícone fuschia/60; hover escurece o fundo (gray-200).
 */
export function SidebarLink({ item, active, onSelect }: SidebarLinkProps) {
  return (
    <li className="w-full">
      <a
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={(e) => {
          e.preventDefault();
          onSelect(item.id);
        }}
        className={cn(
          "flex items-center gap-3 rounded-sm p-3.5 text-base transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-night-sidebar",
          active
            ? "bg-blue-dark text-gray-600"
            : "text-fuschia-60 hover:bg-gray-200 dark:hover:bg-night-border/60",
        )}
      >
        <span className="inline-flex shrink-0">{item.icon}</span>
        <span className="flex-1 leading-[1.4]">{item.label}</span>
      </a>
    </li>
  );
}
