import { BrandLogo } from "./BrandLogo";
import { Avatar } from "./Avatar";
import { InlineIcon } from "./InlineIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import menuIcon from "@/assets/icon-menu.svg?raw";

interface MobileTopBarProps {
  userInitials: string;
  onOpenMenu: () => void;
  menuOpen: boolean;
  /** id do elemento do drawer controlado (aria-controls). */
  menuId: string;
}

/** Barra superior do mobile: hambúrguer + marca + avatar (Figma). */
export function MobileTopBar({
  userInitials,
  onOpenMenu,
  menuOpen,
  menuId,
}: MobileTopBarProps) {
  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu de navegação"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="flex size-10 items-center justify-center rounded-sm bg-gray-200 text-gray-600 transition-colors hover:bg-gray-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base dark:bg-night-border dark:hover:bg-night-border/70"
        >
          <InlineIcon svg={menuIcon} className="size-5 [&>svg]:size-5" />
        </button>
        <BrandLogo iconSize={44} />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Avatar initials={userInitials} size="md" />
      </div>
    </div>
  );
}
