import { kes } from "@/lib/mock-data";

export function ChartTooltip({
  active,
  payload,
  label,
  showTotal,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
  showTotal?: boolean;
}) {
  if (!active || !payload || !payload.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);

  return (
    <div className="min-w-[160px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 shadow-[0_12px_32px_-8px_rgb(20_30_22_/_0.18)] text-[12.5px] animate-fade-in">
      <p className="font-semibold text-[var(--foreground)] mb-2 text-[13px]">{label}</p>
      <div className="flex flex-col gap-1.5">
        {[...payload].reverse().map((p) => (
          <div key={p.name} className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-[3px] shrink-0" style={{ background: p.color }} />
            <span className="text-[var(--muted-foreground)]">{p.name}</span>
            <span className="ml-auto font-semibold tabular">{kes(p.value)}</span>
          </div>
        ))}
      </div>
      {showTotal && payload.length > 1 && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]">
          <span className="text-[var(--muted-foreground)]">Total</span>
          <span className="font-semibold tabular">{kes(total)}</span>
        </div>
      )}
    </div>
  );
}
