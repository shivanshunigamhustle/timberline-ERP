"use client";

import { useState } from "react";
import { Check, Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { AddEquipmentModal } from "@/components/modals/add-equipment-modal";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { EquipmentCondition } from "@/lib/types";

const CONDITIONS: EquipmentCondition[] = ["Good", "Needs attention", "Out of service"];

export function EquipmentRegister() {
  const equipment = useErpStore((s) => s.equipment);
  const updateEquipmentCondition = useErpStore((s) => s.updateEquipmentCondition);
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftCondition, setDraftCondition] = useState<EquipmentCondition>("Good");

  return (
    <div>
      <PageHeader
        title="Equipment register"
        description="Loading equipment, workshop tools and office equipment."
        actions={
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            <Plus size={14} /> Add equipment
          </Button>
        }
      />

      <Card>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Category</TH>
              <TH>Purchase date</TH>
              <TH>Purchase value</TH>
              <TH>Condition</TH>
              <TH />
            </tr>
          </THead>
          <tbody>
            {equipment.map((eq) => (
              <TRow key={eq.id}>
                <TD className="font-medium">{eq.name}</TD>
                <TD>
                  <Badge tone="slate">{eq.category}</Badge>
                </TD>
                <TD className="text-[var(--muted-foreground)]">{eq.purchaseDate}</TD>
                <TD className="tabular">{kes(eq.purchaseValue)}</TD>
                <TD>
                  {editingId === eq.id ? (
                    <div className="flex items-center gap-1.5">
                      <Select
                        className="w-auto h-8"
                        value={draftCondition}
                        onChange={(e) => setDraftCondition(e.target.value as EquipmentCondition)}
                      >
                        {CONDITIONS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </Select>
                      <button
                        onClick={() => {
                          updateEquipmentCondition(eq.id, draftCondition);
                          setEditingId(null);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
                      >
                        <Check size={15} />
                      </button>
                    </div>
                  ) : (
                    <StatusBadge status={eq.condition} />
                  )}
                </TD>
                <TD>
                  {editingId !== eq.id && (
                    <button
                      onClick={() => {
                        setEditingId(eq.id);
                        setDraftCondition(eq.condition);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <AddEquipmentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
