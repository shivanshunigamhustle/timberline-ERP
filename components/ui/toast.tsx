"use client";

import { CheckCircle2, XCircle, Info } from "lucide-react";
import { useToastStore } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[320px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-toast-in flex items-start gap-2.5 rounded-[10px] border bg-[var(--surface)] px-3.5 py-3 shadow-[var(--shadow-md)] text-[13px]",
            t.tone === "success" && "border-[var(--brand)]/25",
            t.tone === "error" && "border-[var(--accent-red)]/30",
            (!t.tone || t.tone === "default") && "border-[var(--border)]"
          )}
        >
          {t.tone === "success" ? (
            <CheckCircle2 size={17} className="text-[var(--brand)] mt-0.5 shrink-0" />
          ) : t.tone === "error" ? (
            <XCircle size={17} className="text-[var(--accent-red)] mt-0.5 shrink-0" />
          ) : (
            <Info size={17} className="text-[var(--accent-slate)] mt-0.5 shrink-0" />
          )}
          <span className="text-[var(--foreground)] leading-5">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
