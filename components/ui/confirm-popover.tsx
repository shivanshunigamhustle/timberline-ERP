"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./button";

export function ConfirmPopover({
  trigger,
  message,
  confirmLabel = "Confirm",
  onConfirm,
}: {
  trigger: React.ReactNode;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div className="animate-modal-in absolute right-0 top-full mt-2 z-20 w-56 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-md)]">
          <p className="text-[12.5px] text-[var(--foreground)] mb-2.5">{message}</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
