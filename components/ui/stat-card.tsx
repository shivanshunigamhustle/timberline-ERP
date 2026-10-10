"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

export function StatCard({
  label,
  value,
  sub,
  delta,
  deltaTone = "green",
  onClick,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  delta?: string;
  deltaTone?: "green" | "red";
  onClick?: () => void;
  icon?: ReactNode;
  highlight?: "amber" | "red";
}) {
  return (
    <Card
      className={cn(
        "p-4 flex flex-col gap-2 transition-all duration-150",
        onClick && "cursor-pointer hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className="text-left w-full disabled:cursor-default"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-[13px] font-medium text-[var(--muted-foreground)] truncate min-w-0">{label}</span>
          {icon && (
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                highlight === "red"
                  ? "bg-[var(--accent-red-bg)] text-[var(--accent-red)]"
                  : highlight === "amber"
                  ? "bg-[var(--accent-amber-bg)] text-[var(--accent-amber)]"
                  : "bg-[var(--brand-light)] text-[var(--brand)]"
              )}
            >
              {icon}
            </span>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
          <span className="text-[26px] font-semibold tabular tracking-tight whitespace-nowrap">{value}</span>
          {delta && (
            <span
              className={cn(
                "text-[12px] font-medium rounded-full px-1.5 py-0.5 whitespace-nowrap",
                deltaTone === "green" ? "bg-[var(--brand-light)] text-[var(--brand-dark)]" : "bg-[var(--accent-red-bg)] text-[var(--accent-red)]"
              )}
            >
              {delta}
            </span>
          )}
        </div>
        {sub && <div className="text-[12.5px] text-[var(--muted-foreground)] leading-5 mt-1.5">{sub}</div>}
      </button>
    </Card>
  );
}
