"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import { kes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Till } from "@/lib/types";

export function OpenTillModal({ till, open, onClose }: { till: Till; open: boolean; onClose: () => void }) {
  const openTill = useErpStore((s) => s.openTill);
  const [float, setFloat] = useState(till.openingFloat);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Open till"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              openTill(till.id, float);
              onClose();
            }}
          >
            Open
          </Button>
        </>
      }
    >
      <Field label="Opening float (KES)" hint="Defaults to yesterday's closing float">
        <Input type="number" value={float} onChange={(e) => setFloat(Number(e.target.value))} />
      </Field>
    </Modal>
  );
}

export function CloseTillModal({
  till,
  cashTotal,
  mpesaTotal,
  open,
  onClose,
}: {
  till: Till;
  cashTotal: number;
  mpesaTotal: number;
  open: boolean;
  onClose: () => void;
}) {
  const closeTill = useErpStore((s) => s.closeTill);
  const [counted, setCounted] = useState(till.openingFloat + cashTotal);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Close ${till.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              closeTill(till.id, counted);
              onClose();
            }}
          >
            Close till
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-[8px] bg-[var(--surface-muted)] p-3">
          <p className="text-[11.5px] text-[var(--muted-foreground)]">Cash collected</p>
          <p className="text-[15px] font-semibold tabular mt-0.5">{kes(cashTotal)}</p>
        </div>
        <div className="rounded-[8px] bg-[var(--surface-muted)] p-3">
          <p className="text-[11.5px] text-[var(--muted-foreground)]">M-Pesa collected</p>
          <p className="text-[15px] font-semibold tabular mt-0.5">{kes(mpesaTotal)}</p>
        </div>
      </div>
      <Field label="Counted cash (KES)">
        <Input type="number" value={counted} onChange={(e) => setCounted(Number(e.target.value))} />
      </Field>
    </Modal>
  );
}

export function ReconcileTillModal({ till, open, onClose }: { till: Till; open: boolean; onClose: () => void }) {
  const reconcileTill = useErpStore((s) => s.reconcileTill);
  const expected = till.openingFloat + (till.countedCash ?? 0) - (till.variance ?? 0);
  const [counted, setCounted] = useState(till.countedCash ?? expected);
  const variance = counted - expected;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Reconcile ${till.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              reconcileTill(till.id, counted);
              onClose();
            }}
          >
            Confirm reconciliation
          </Button>
        </>
      }
    >
      <div className="rounded-[8px] bg-[var(--surface-muted)] p-3 mb-4">
        <p className="text-[11.5px] text-[var(--muted-foreground)]">Expected cash</p>
        <p className="text-[15px] font-semibold tabular mt-0.5">{kes(expected)}</p>
      </div>
      <Field label="Counted amount (KES)">
        <Input type="number" value={counted} onChange={(e) => setCounted(Number(e.target.value))} />
      </Field>
      <div className="flex items-center justify-between rounded-[8px] px-3 py-2.5 bg-[var(--surface-muted)]">
        <span className="text-[12.5px] text-[var(--muted-foreground)]">Variance</span>
        <span className={cn("text-[13.5px] font-semibold tabular", variance === 0 ? "text-[var(--brand-dark)]" : "text-[var(--accent-red)]")}>
          {variance === 0 ? "KES 0" : kes(variance)}
        </span>
      </div>
    </Modal>
  );
}
