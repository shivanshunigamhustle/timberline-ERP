import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3.5">
      <span className="block text-[13px] font-medium text-[var(--muted-foreground)] mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[12px] text-[var(--muted-foreground)] mt-1">{hint}</span>}
    </label>
  );
}

const fieldBase =
  "w-full h-[38px] rounded-[8px] border border-[var(--border)] bg-white px-3 text-[14px] outline-none transition-shadow focus:ring-2 focus:ring-[var(--brand)]/25 focus:border-[var(--brand)] placeholder:text-[var(--muted-foreground)]";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, props.className)} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "appearance-none bg-white", props.className)} {...props} />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, "h-auto py-2 min-h-[80px] resize-none", props.className)}
      {...props}
    />
  );
}
