"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { CostType } from "@/lib/types";
import { todayIso } from "@/lib/utils";

const COST_TYPES: CostType[] = ["Fuel", "Service", "Repair", "Insurance", "Other"];

export function LogRunningCostModal({ truckId, open, onClose }: { truckId: string; open: boolean; onClose: () => void }) {
  const logRunningCost = useErpStore((s) => s.logRunningCost);
  const [type, setType] = useState<CostType>("Fuel");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(todayIso());
  const [note, setNote] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log running cost"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              logRunningCost(truckId, { type, amount, date, note });
              setAmount(0);
              setNote("");
              onClose();
            }}
          >
            Log
          </Button>
        </>
      }
    >
      <Field label="Type">
        <Select value={type} onChange={(e) => setType(e.target.value as CostType)}>
          {COST_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Amount (KES)">
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} />
      </Field>
      <Field label="Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <Field label="Note">
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Shell Mombasa Rd" />
      </Field>
    </Modal>
  );
}
