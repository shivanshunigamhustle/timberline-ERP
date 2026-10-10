"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useErpStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const ROLES: Role[] = ["Owner", "Accountant", "Cashier", "Warehouse", "Driver"];

export function InviteUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inviteUser = useErpStore((s) => s.inviteUser);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Cashier");
  const [email, setEmail] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite user"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!name || !email}
            onClick={() => {
              inviteUser({ name, role, email });
              setName("");
              setEmail("");
              onClose();
            }}
          >
            Send invite
          </Button>
        </>
      }
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mary Achieng" />
      </Field>
      <Field label="Role">
        <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r === "Owner" ? "Owner / Admin" : r === "Driver" ? "Driver / Dispatch" : r}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@timberlinetraders.co.ke" />
      </Field>
    </Modal>
  );
}
