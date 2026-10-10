"use client";

import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[38px] w-60 rounded-[8px] border border-[var(--border)] bg-white pl-8 pr-3 text-[14px] outline-none transition-shadow focus:ring-2 focus:ring-[var(--brand)]/25 focus:border-[var(--brand)] placeholder:text-[var(--muted-foreground)]"
      />
    </div>
  );
}
