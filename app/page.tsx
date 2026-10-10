"use client";

import { useRouter } from "next/navigation";
import { TreePine, Crown, Calculator, Wallet, Warehouse, Truck, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/store";
import { ROLE_LANDING } from "@/lib/nav-config";
import { Avatar } from "@/components/ui/avatar";
import { roleCoverUrl } from "@/lib/images";
import type { Role } from "@/lib/types";

const ROLE_CARDS: { role: Role; title: string; blurb: string; userName: string; icon: typeof Crown; cover: string }[] = [
  {
    role: "Owner",
    title: "Owner / Admin",
    blurb: "Profit by product line, cash position, stock health and fleet — and manage everything underneath.",
    userName: "Catherine Mwangi",
    icon: Crown,
    cover: roleCoverUrl("Owner"),
  },
  {
    role: "Accountant",
    title: "Accountant",
    blurb: "Pull clean, KRA-compliant statements and transaction detail — no file exchange needed.",
    userName: "David Omondi",
    icon: Calculator,
    cover: roleCoverUrl("Accountant"),
  },
  {
    role: "Cashier",
    title: "Cashier",
    blurb: "Record every cash and M-Pesa sale, and reconcile the till against what's actually banked.",
    userName: "Grace Wanjiru",
    icon: Wallet,
    cover: roleCoverUrl("Cashier"),
  },
  {
    role: "Warehouse",
    title: "Warehouse",
    blurb: "Know what's in stock across timber, gas and bio-products, and get ahead of reorders.",
    userName: "Felix Langat",
    icon: Warehouse,
    cover: roleCoverUrl("Warehouse"),
  },
  {
    role: "Driver / Dispatch",
    title: "Driver / Dispatch",
    blurb: "See today's deliveries truck-by-truck and log fuel and running costs on the road.",
    userName: "Samuel Kiptoo",
    icon: Truck,
    cover: roleCoverUrl("Driver"),
  },
].map((c) => ({ ...c, role: (c.role === "Driver / Dispatch" ? "Driver" : c.role) as Role }));

export default function RolePickerPage() {
  const router = useRouter();
  const login = useSession((s) => s.login);

  function handleSelect(role: Role, userName: string) {
    login(role, userName);
    router.push(ROLE_LANDING[role]);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_var(--brand-light)_0%,_var(--background)_55%)] px-6 py-14">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--brand)] text-white shadow-[var(--shadow-md)]">
          <TreePine size={24} />
        </div>
        <div>
          <p className="text-[19px] font-semibold text-[var(--foreground)] leading-tight">Timberline Traders</p>
          <p className="text-[13.5px] text-[var(--muted-foreground)] leading-tight">Timber &middot; Gas &middot; Bio-products</p>
        </div>
      </div>
      <h1 className="text-[28px] font-semibold text-[var(--foreground)] mt-8 mb-2 text-center tracking-tight">Who&apos;s signing in?</h1>
      <p className="text-[14.5px] text-[var(--muted-foreground)] mb-10 text-center max-w-md">
        Pick a role to continue — this demo has no passwords. Each card logs straight into that role&apos;s view.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
        {ROLE_CARDS.map(({ role, title, blurb, userName, icon: Icon, cover }) => (
          <button
            key={role}
            onClick={() => handleSelect(role, userName)}
            className="group text-left overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-1 hover:border-[var(--brand)]/40"
          >
            <div className="relative h-28 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/95 text-[var(--brand-dark)] shadow-[var(--shadow-sm)]">
                <Icon size={19} />
              </div>
            </div>
            <div className="p-5">
              <p className="text-[16px] font-semibold text-[var(--foreground)]">{title}</p>
              <p className="text-[13.5px] text-[var(--muted-foreground)] mt-1.5 leading-[1.5]">{blurb}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Avatar name={userName} size={24} />
                  <span className="text-[12.5px] text-[var(--muted-foreground)]">as {userName}</span>
                </div>
                <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--brand-dark)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Continue <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
