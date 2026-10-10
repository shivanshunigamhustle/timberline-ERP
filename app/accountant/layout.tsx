import { AppShell } from "@/components/layout/app-shell";

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="Accountant">{children}</AppShell>;
}
