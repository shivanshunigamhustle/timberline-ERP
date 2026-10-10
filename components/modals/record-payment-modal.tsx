"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { Invoice, PaymentMethod } from "@/lib/types";
import { todayIso } from "@/lib/utils";

const METHODS: PaymentMethod[] = ["M-Pesa", "Cash", "Bank transfer"];

export function RecordPaymentModal({ invoice, open, onClose }: { invoice: Invoice; open: boolean; onClose: () => void }) {
  const recordPayment = useErpStore((s) => s.recordPayment);
  const balance = Math.round(invoice.amount + invoice.vatAmount);
  const [amount, setAmount] = useState(balance);
  const [method, setMethod] = useState<PaymentMethod>("M-Pesa");
  const [date, setDate] = useState(todayIso());
  const [reference, setReference] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record payment"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              recordPayment(invoice.id, amount, method, reference);
              onClose();
            }}
          >
            Record
          </Button>
        </>
      }
    >
      <Field label="Amount (KES)">
        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </Field>
      <Field label="Method">
        <Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
          {METHODS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </Select>
      </Field>
      <Field label="Date">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <Field label="Reference">
        <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. QFT7X2KL9M" />
      </Field>
    </Modal>
  );
}
