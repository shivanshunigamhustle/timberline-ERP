import { AppShell } from "@/components/layout/app-shell";

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="Cashier">{children}</AppShell>;
}
