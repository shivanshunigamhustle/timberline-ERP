"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] shadow-sm",
  secondary: "bg-white text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-muted)]",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
  danger: "bg-[var(--accent-red)] text-white hover:brightness-95",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13.5px] gap-1.5",
  md: "h-[38px] px-4 text-[14.5px] gap-2",
  icon: "h-8 w-8 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius)] font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
