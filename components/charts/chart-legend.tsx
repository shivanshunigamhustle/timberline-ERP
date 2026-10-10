export function ChartLegend({ payload }: { payload?: { value: string; color?: string }[] }) {
  if (!payload) return null;
  return (
    <div className="flex items-center justify-center gap-5 pt-3">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: entry.color }} />
          <span className="text-[12.5px] font-medium text-[var(--muted-foreground)]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
