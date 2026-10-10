"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { Bank } from "@/lib/types";
import { todayIso } from "@/lib/utils";

const BANKS: Bank[] = ["Equity Bank", "KCB", "Co-operative Bank"];

export function LogBankDepositModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const logBankDeposit = useErpStore((s) => s.logBankDeposit);
  const [amount, setAmount] = useState(0);
  const [bank, setBank] = useState<Bank>("Equity Bank");
  const [date, setDate] = useState(todayIso());
  const [reference, setReference] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log bank deposit"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!amount || !reference}
            onClick={() => {
              logBankDeposit({ amount, bank, date, reference });
              setAmount(0);
              setReference("");
              onClose();
            }}
          >
            Log
          </Button>
        </>
      }
    >
      <Field label="Amount (KES)">
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </Field>
      <Field label="Bank">
        <Select value={bank} onChange={(e) => setBank(e.target.value as Bank)}>
          {BANKS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </Select>
      </Field>
      <Field label="Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <Field label="Reference / slip number">
        <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. SLIP-88301" />
      </Field>
    </Modal>
  );
}
