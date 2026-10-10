"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, TreePine } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "@/lib/store";
import { NAV_BY_ROLE } from "@/lib/nav-config";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const ROLE_PORTAL_LABEL: Record<Role, string> = {
  Owner: "Owner / Admin",
  Accountant: "Accountant portal",
  Cashier: "Cashier",
  Warehouse: "Warehouse",
  Driver: "Driver / Dispatch",
};

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.role) router.replace("/");
  }, [session.role, router]);

  const navItems = NAV_BY_ROLE[role];

  const today = new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-[232px] shrink-0 bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] flex flex-col">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--sidebar-accent)] text-white">
            <TreePine size={16} />
          </div>
          <div className="leading-tight">
            <p className="text-[14.5px] font-semibold text-white">Timberline</p>
            <p className="text-[11px] text-[var(--sidebar-fg)]/70 -mt-0.5">Traders ERP</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium transition-colors duration-150",
                  active ? "bg-white/10 text-white" : "text-[var(--sidebar-fg)] hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={16} className={active ? "text-[var(--sidebar-accent)]" : "opacity-80"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => {
              session.logout();
              router.push("/");
            }}
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium text-[var(--sidebar-fg)] hover:bg-white/5 hover:text-white transition-colors duration-150"
          >
            <LogOut size={16} className="opacity-80" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6 shrink-0">
          <div>
            <p className="text-[15px] font-semibold text-[var(--foreground)]">Timberline Traders</p>
            <p className="text-[12.5px] text-[var(--muted-foreground)]">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-[13.5px] font-medium text-[var(--foreground)]">{session.userName}</p>
              <p className="text-[12px] text-[var(--muted-foreground)]">{ROLE_PORTAL_LABEL[role]}</p>
            </div>
            {session.userName && <Avatar name={session.userName} size={36} />}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--background)]">
          <div className="max-w-[1400px] mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
