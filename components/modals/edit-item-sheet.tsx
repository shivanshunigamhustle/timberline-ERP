"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import { SUPPLIERS } from "@/lib/mock-data";
import type { Item } from "@/lib/types";

export function EditItemSheet({ item, open, onClose }: { item: Item; open: boolean; onClose: () => void }) {
  const editItem = useErpStore((s) => s.editItem);
  const [name, setName] = useState(item.name);
  const [unit, setUnit] = useState(item.unit);
  const [reorderPoint, setReorderPoint] = useState(item.reorderPoint);
  const [unitPrice, setUnitPrice] = useState(item.unitPrice);
  const [supplier, setSupplier] = useState(item.supplier);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Edit item"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              editItem(item.id, { name, unit, reorderPoint, unitPrice, supplier });
              onClose();
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Unit">
        <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
      </Field>
      <Field label="Reorder point">
        <Input type="number" value={reorderPoint} onChange={(e) => setReorderPoint(Number(e.target.value))} />
      </Field>
      <Field label="Unit price (KES)">
        <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
      </Field>
      <Field label="Supplier">
        <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
          {SUPPLIERS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </Field>
    </Sheet>
  );
}
