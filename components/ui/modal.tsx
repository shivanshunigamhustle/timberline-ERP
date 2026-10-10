"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const widthClass = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" }[width];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/35 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-[14px] bg-[var(--surface)] shadow-[var(--shadow-md)] animate-modal-in border border-[var(--border)]",
          widthClass
        )}
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-[15px] font-semibold">{title}</h2>
            {description && <p className="text-[12.5px] text-[var(--muted-foreground)] mt-0.5">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>
        <div className="px-5 py-4 max-h-[65vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border)]">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
