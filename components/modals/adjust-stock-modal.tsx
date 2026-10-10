"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { Item } from "@/lib/types";

const ADJUSTMENT_TYPES = ["Damage", "Count correction", "Internal use"] as const;

export function AdjustStockModal({ item, open, onClose }: { item: Item; open: boolean; onClose: () => void }) {
  const adjustStock = useErpStore((s) => s.adjustStock);
  const [type, setType] = useState<(typeof ADJUSTMENT_TYPES)[number]>("Count correction");
  const [qty, setQty] = useState(0);
  const [note, setNote] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adjust stock"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={qty === 0}
            onClick={() => {
              adjustStock(item.id, type, qty, note);
              setQty(0);
              setNote("");
              onClose();
            }}
          >
            Save adjustment
          </Button>
        </>
      }
    >
      <Field label="Adjustment type">
        <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          {ADJUSTMENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Quantity" hint="Can be negative, e.g. -3">
        <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      </Field>
      <Field label="Note">
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Damp bags found during count" />
      </Field>
    </Modal>
  );
}
