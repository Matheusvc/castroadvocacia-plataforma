import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type { SidebarUser } from "@/components/layout/Sidebar";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { ConversasPage } from "@/components/pages/ConversasPage";
import { ClientesPage } from "@/components/pages/ClientesPage";
import { ServicosPage } from "@/components/pages/ServicosPage";
import { LoginPage } from "@/components/pages/LoginPage";
import { useHashRoute } from "@/hooks/useHashRoute";
import { usePersistentState } from "@/hooks/usePersistentState";

const currentUser: SidebarUser = {
  name: "Usuário Adm",
  email: "user.adm@test.com",
  initials: "UA",
};

const ROUTES = ["dashboard", "conversas", "clientes", "servicos"] as const;
type Route = (typeof ROUTES)[number];

const PAGES: Record<Route, ReactNode> = {
  dashboard: <DashboardPage />,
  conversas: <ConversasPage />,
  clientes: <ClientesPage />,
  servicos: <ServicosPage />,
};

export default function App() {
  const [route, navigate] = useHashRoute<Route>(ROUTES, "dashboard");
  const [isAuthenticated, setIsAuthenticated] = usePersistentState("castro.auth", false);

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={() => {
          setIsAuthenticated(true);
          navigate("dashboard");
        }}
      />
    );
  }

  return (
    <DashboardLayout
      activeId={route}
      onSelect={(id) => navigate(id as Route)}
      user={currentUser}
      onLogout={() => setIsAuthenticated(false)}
    >
      {PAGES[route]}
    </DashboardLayout>
  );
}
