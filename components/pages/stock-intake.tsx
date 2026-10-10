"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { ITEMS, SUPPLIERS } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import { genId, todayIso } from "@/lib/utils";

interface IntakeRecord {
  id: string;
  date: string;
  itemName: string;
  qty: number;
  supplier: string;
  deliveryNote: string;
}

export function StockIntake() {
  const intakeStock = useErpStore((s) => s.intakeStock);
  const [itemId, setItemId] = useState(ITEMS[0].id);
  const [qty, setQty] = useState(0);
  const [supplier, setSupplier] = useState(SUPPLIERS[0]);
  const [date, setDate] = useState(todayIso());
  const [deliveryNote, setDeliveryNote] = useState("");
  const [recent, setRecent] = useState<IntakeRecord[]>([]);

  function handleLog() {
    const item = ITEMS.find((i) => i.id === itemId)!;
    intakeStock(itemId, qty, supplier, date, deliveryNote);
    setRecent((prev) => [{ id: genId("rec"), date, itemName: item.name, qty, supplier, deliveryNote }, ...prev]);
    setQty(0);
    setDeliveryNote("");
  }

  return (
    <div>
      <PageHeader title="Stock intake" description="Log stock arriving outside the reorder flow." />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Intake form</CardTitle>
          </CardHeader>
          <CardBody>
            <Field label="Item">
              <Select value={itemId} onChange={(e) => setItemId(e.target.value)}>
                {ITEMS.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Quantity received">
              <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} min={1} />
            </Field>
            <Field label="Supplier">
              <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                {SUPPLIERS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Delivery note number">
              <Input value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} placeholder="e.g. DN-2318" />
            </Field>
            <Button variant="primary" className="w-full" disabled={!qty} onClick={handleLog}>
              Log intake
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent intakes</CardTitle>
          </CardHeader>
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-[var(--muted-foreground)]">Nothing logged this session yet.</p>
          ) : (
            <Table>
              <THead>
                <tr>
                  <TH>Date</TH>
                  <TH>Item</TH>
                  <TH>Quantity</TH>
                  <TH>Supplier</TH>
                  <TH>Delivery note #</TH>
                </tr>
              </THead>
              <tbody>
                {recent.map((r) => (
                  <TRow key={r.id}>
                    <TD className="text-[var(--muted-foreground)]">{r.date}</TD>
                    <TD className="font-medium">{r.itemName}</TD>
                    <TD className="tabular">+{r.qty}</TD>
                    <TD>{r.supplier}</TD>
                    <TD className="text-[var(--muted-foreground)]">{r.deliveryNote || "—"}</TD>
                  </TRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
