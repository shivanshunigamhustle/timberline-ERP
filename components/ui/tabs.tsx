"use client";

import { cn } from "@/lib/utils";

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-5 border-b border-[var(--border)]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative pb-2.5 pt-1 text-[14.5px] font-medium transition-colors duration-150",
            value === tab ? "text-[var(--brand-dark)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          {tab}
          {value === tab && <span className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-[var(--brand)]" />}
        </button>
      ))}
    </div>
  );
}
