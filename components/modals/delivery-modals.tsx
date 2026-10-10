"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { Delivery } from "@/lib/types";

export function ConfirmDeliveryModal({ delivery, open, onClose }: { delivery: Delivery; open: boolean; onClose: () => void }) {
  const updateDeliveryStatus = useErpStore((s) => s.updateDeliveryStatus);
  const [receivedBy, setReceivedBy] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm delivery"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!receivedBy}
            onClick={() => {
              updateDeliveryStatus(delivery.id, "Delivered", { receivedBy, notes });
              onClose();
            }}
          >
            Confirm
          </Button>
        </>
      }
    >
      <Field label="Received by">
        <Input value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} placeholder="e.g. Store manager name" />
      </Field>
      <Field label="Notes (optional)">
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
    </Modal>
  );
}

const FAIL_REASONS = ["Customer unavailable", "Access issue", "Wrong address", "Other"];

export function DeliveryIssueModal({ delivery, open, onClose }: { delivery: Delivery; open: boolean; onClose: () => void }) {
  const updateDeliveryStatus = useErpStore((s) => s.updateDeliveryStatus);
  const [reason, setReason] = useState(FAIL_REASONS[0]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delivery issue"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              updateDeliveryStatus(delivery.id, "Failed", { failReason: reason });
              onClose();
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <Field label="Reason">
        <Select value={reason} onChange={(e) => setReason(e.target.value)}>
          {FAIL_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Select>
      </Field>
    </Modal>
  );
}
