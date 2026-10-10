import { cn } from "@/lib/utils";

export type BadgeTone = "green" | "amber" | "red" | "blue" | "slate";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-[var(--brand-light)] text-[var(--brand-dark)]",
  amber: "bg-[var(--accent-amber-bg)] text-[var(--accent-amber)]",
  red: "bg-[var(--accent-red-bg)] text-[var(--accent-red)]",
  blue: "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]",
  slate: "bg-[var(--accent-slate-bg)] text-[var(--accent-slate)]",
};

export function Badge({
  children,
  tone = "slate",
  className,
  dot,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold leading-none whitespace-nowrap",
        toneClasses[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", `bg-current`)} />}
      {children}
    </span>
  );
}

const PRODUCT_LINE_TONE: Record<string, BadgeTone> = {
  Timber: "green",
  Gas: "blue",
  "Bio-products": "amber",
};

export function ProductLineBadge({ line }: { line: string }) {
  return <Badge tone={PRODUCT_LINE_TONE[line] ?? "slate"}>{line}</Badge>;
}

const STATUS_TONE: Record<string, BadgeTone> = {
  // invoices
  Draft: "slate",
  Sent: "blue",
  Paid: "green",
  Overdue: "red",
  Submitted: "green",
  Pending: "amber",
  // items
  "In stock": "green",
  Low: "amber",
  Reorder: "red",
  "On order": "blue",
  // trucks / tills / users
  "On route": "blue",
  "At depot": "slate",
  "In service": "amber",
  Open: "green",
  Closed: "slate",
  Reconciled: "green",
  Active: "green",
  Invited: "blue",
  Deactivated: "red",
  // delivery
  "En route": "blue",
  Delivered: "green",
  Failed: "red",
  // misc
  Matched: "green",
  Mismatch: "red",
  Good: "green",
  "Needs attention": "amber",
  "Out of service": "red",
  Flagged: "amber",
  Ordered: "blue",
  Received: "green",
  Balanced: "green",
  Over: "blue",
  Short: "red",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? "slate"}>{status}</Badge>;
}
