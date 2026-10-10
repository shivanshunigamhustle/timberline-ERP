"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { Invoice } from "@/lib/types";

export function SendInvoiceModal({ invoice, open, onClose }: { invoice: Invoice; open: boolean; onClose: () => void }) {
  const sendInvoice = useErpStore((s) => s.sendInvoice);
  const [email, setEmail] = useState(`accounts@${invoice.customerName.toLowerCase().replace(/[^a-z]+/g, "")}.co.ke`);
  const [message, setMessage] = useState(
    `Hello, please find attached invoice ${invoice.invoiceNumber} for KES ${Math.round(invoice.amount + invoice.vatAmount).toLocaleString("en-KE")}, due ${invoice.dueDate}. Thank you for your business — Timberline Traders.`
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send invoice"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              sendInvoice(invoice.id);
              onClose();
            }}
          >
            Send
          </Button>
        </>
      }
    >
      <Field label="Email">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Message">
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </Field>
    </Modal>
  );
}
