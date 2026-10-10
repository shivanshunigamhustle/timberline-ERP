"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SUPPLIERS } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { Item } from "@/lib/types";
import { todayIso } from "@/lib/utils";

export function PurchaseOrderModal({ item, open, onClose }: { item: Item | null; open: boolean; onClose: () => void }) {
  const createPurchaseOrder = useErpStore((s) => s.createPurchaseOrder);
  const [supplier, setSupplier] = useState(item?.supplier ?? SUPPLIERS[0]);
  const [qty, setQty] = useState(item ? Math.max(item.reorderPoint * 2 - item.stockOnHand, item.reorderPoint) : 0);
  const [date, setDate] = useState(todayIso());

  useEffect(() => {
    if (item) {
      setSupplier(item.supplier);
      setQty(Math.max(item.reorderPoint * 2 - item.stockOnHand, item.reorderPoint));
      setDate(todayIso());
    }
  }, [item]);

  if (!item) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Create purchase order for ${item.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              createPurchaseOrder(item.id, supplier, qty, date);
              onClose();
            }}
          >
            Create PO
          </Button>
        </>
      }
    >
      <Field label="Supplier">
        <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
          {SUPPLIERS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </Field>
      <Field label="Quantity" hint={`Reorder point: ${item.reorderPoint} ${item.unit}`}>
        <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} min={1} />
      </Field>
      <Field label="Expected delivery date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
    </Modal>
  );
}
