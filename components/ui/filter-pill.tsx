"use client";

import { cn } from "@/lib/utils";

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
            value === opt ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-sm)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
