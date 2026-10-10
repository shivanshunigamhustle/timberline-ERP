import { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--muted-foreground)] mb-3">
        <Icon size={20} />
      </div>
      <p className="text-[13.5px] font-medium text-[var(--foreground)]">{title}</p>
      {description && <p className="text-[12.5px] text-[var(--muted-foreground)] mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
