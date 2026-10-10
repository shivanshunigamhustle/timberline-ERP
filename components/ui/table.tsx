import { cn } from "@/lib/utils";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13.5px] border-collapse">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-[var(--surface-muted)] text-[12.5px] text-[var(--muted-foreground)] font-semibold uppercase tracking-wide">{children}</thead>;
}

export function TH({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-2.5 whitespace-nowrap font-medium", className)}>{children}</th>;
}

export function TRow({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-[var(--border)] last:border-0 transition-colors duration-100",
        onClick && "cursor-pointer hover:bg-[var(--surface-muted)]",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 align-middle whitespace-nowrap", className)}>{children}</td>;
}
