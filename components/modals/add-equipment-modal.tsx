"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { EquipmentCategory } from "@/lib/types";
import { todayIso } from "@/lib/utils";

const CATEGORIES: EquipmentCategory[] = ["Loading equipment", "Workshop tools", "Office equipment", "Other"];

export function AddEquipmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addEquipment = useErpStore((s) => s.addEquipment);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<EquipmentCategory>("Loading equipment");
  const [purchaseDate, setPurchaseDate] = useState(todayIso());
  const [purchaseValue, setPurchaseValue] = useState(0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add equipment"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!name}
            onClick={() => {
              addEquipment({ name, category, purchaseDate, purchaseValue, condition: "Good" });
              setName("");
              setPurchaseValue(0);
              onClose();
            }}
          >
            Add
          </Button>
        </>
      }
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pallet jack" />
      </Field>
      <Field label="Category">
        <Select value={category} onChange={(e) => setCategory(e.target.value as EquipmentCategory)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>
      <Field label="Purchase date">
        <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
      </Field>
      <Field label="Purchase value (KES)">
        <Input type="number" value={purchaseValue} onChange={(e) => setPurchaseValue(Number(e.target.value))} min={0} />
      </Field>
    </Modal>
  );
}
