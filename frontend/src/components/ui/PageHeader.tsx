interface PageHeaderProps {
  title: string;
}

/** Título de página em blue/dark (Figma: 20px mobile / 24px desktop, Lato Bold). */
export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="shrink-0">
      <h1 className="text-lg font-bold uppercase leading-[1.4] text-blue-dark lg:text-xl">
        {title}
      </h1>
    </header>
  );
}
