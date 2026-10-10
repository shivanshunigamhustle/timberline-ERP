import { AppShell } from "@/components/layout/app-shell";

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="Warehouse">{children}</AppShell>;
}
