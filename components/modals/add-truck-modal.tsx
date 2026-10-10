"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";

export function AddTruckModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addTruck = useErpStore((s) => s.addTruck);
  const [registration, setRegistration] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [year, setYear] = useState(2024);
  const [assignedDriver, setAssignedDriver] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add truck"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!registration || !makeModel}
            onClick={() => {
              addTruck({ registration, makeModel, year, assignedDriver });
              setRegistration("");
              setMakeModel("");
              setAssignedDriver("");
              onClose();
            }}
          >
            Add
          </Button>
        </>
      }
    >
      <Field label="Registration number">
        <Input value={registration} onChange={(e) => setRegistration(e.target.value)} placeholder="e.g. KDA 110T" />
      </Field>
      <Field label="Make / model">
        <Input value={makeModel} onChange={(e) => setMakeModel(e.target.value)} placeholder="e.g. Isuzu FRR 90" />
      </Field>
      <Field label="Year">
        <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </Field>
      <Field label="Assigned driver">
        <Input value={assignedDriver} onChange={(e) => setAssignedDriver(e.target.value)} placeholder="e.g. Peter Njoroge" />
      </Field>
    </Modal>
  );
}
