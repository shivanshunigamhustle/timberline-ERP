export function PageHeader({
  title,
  description,
  actions,
  image,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  image?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-center gap-3.5">
        {image}
        <div>
          <h1 className="text-[24px] font-semibold text-[var(--foreground)] tracking-tight">{title}</h1>
          {description && <p className="text-[14px] text-[var(--muted-foreground)] mt-1.5">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
