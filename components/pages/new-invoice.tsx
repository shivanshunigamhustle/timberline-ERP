"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { ITEMS, kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import { genId } from "@/lib/utils";
import type { InvoiceLineItem, ProductLine } from "@/lib/types";

const CUSTOMERS = [
  "Rift Valley Hardware Ltd",
  "Mama Njeri Eatery",
  "Equator Builders",
  "GreenGrow Farms",
  "Nakuru Steel Works",
  "Cherengany Timber Yard",
  "Sunrise Hardware",
  "Kiptoo & Sons Timber",
  "Lucy Chebet",
];

export function NewInvoice({ basePath }: { basePath: string }) {
  const router = useRouter();
  const createInvoice = useErpStore((s) => s.createInvoice);

  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [productLine, setProductLine] = useState<ProductLine>("Timber");
  const [lines, setLines] = useState<InvoiceLineItem[]>([]);

  const lineOptions = useMemo(() => ITEMS.filter((i) => i.productLine === productLine), [productLine]);

  function addLine() {
    const defaultItem = lineOptions[0];
    setLines((prev) => [
      ...prev,
      { id: genId("li"), itemId: defaultItem?.id ?? "", description: defaultItem?.name ?? "", qty: 1, unitPrice: defaultItem?.unitPrice ?? 0 },
    ]);
  }

  function updateLine(id: string, patch: Partial<InvoiceLineItem>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  function handleSave(status: "Draft" | "Sent") {
    const inv = createInvoice({ customerName: addingCustomer ? newCustomerName : customer, productLine, lineItems: lines, status });
    router.push(`${basePath}/${inv.id}`);
  }

  return (
    <div>
      <button
        onClick={() => router.push(basePath)}
        className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-3 transition-colors"
      >
        <ArrowLeft size={13} /> Back to invoices
      </button>
      <PageHeader title="New invoice" description="Line items compute VAT and totals automatically." />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-5">
          <Card>
            <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="Customer">
                {addingCustomer ? (
                  <div className="flex gap-2">
                    <Input autoFocus value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} placeholder="New customer name" />
                    <Button variant="secondary" size="sm" onClick={() => setAddingCustomer(false)}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={customer}
                    onChange={(e) => {
                      if (e.target.value === "__new") setAddingCustomer(true);
                      else setCustomer(e.target.value);
                    }}
                  >
                    {CUSTOMERS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                    <option value="__new">+ Add new customer</option>
                  </Select>
                )}
              </Field>
              <Field label="Product line">
                <Select
                  value={productLine}
                  onChange={(e) => {
                    setProductLine(e.target.value as ProductLine);
                    setLines([]);
                  }}
                >
                  <option value="Timber">Timber</option>
                  <option value="Gas">Gas</option>
                  <option value="Bio-products">Bio-products</option>
                </Select>
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line items</CardTitle>
              <Button size="sm" variant="secondary" onClick={addLine}>
                <Plus size={13} /> Add line item
              </Button>
            </CardHeader>
            <CardBody className="p-0">
              {lines.length === 0 ? (
                <p className="px-5 py-8 text-center text-[13px] text-[var(--muted-foreground)]">No line items yet — add one to begin.</p>
              ) : (
                <table className="w-full text-[13px]">
                  <thead className="bg-[var(--surface-muted)] text-[11.5px] text-[var(--muted-foreground)] uppercase tracking-wide">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-medium">Item</th>
                      <th className="text-right px-4 py-2.5 font-medium w-24">Qty</th>
                      <th className="text-right px-4 py-2.5 font-medium w-32">Unit price</th>
                      <th className="text-right px-4 py-2.5 font-medium w-32">Line total</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <tr key={line.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="px-4 py-2.5">
                          <Select
                            value={line.itemId}
                            onChange={(e) => {
                              const item = ITEMS.find((i) => i.id === e.target.value);
                              updateLine(line.id, { itemId: e.target.value, description: item?.name ?? "", unitPrice: item?.unitPrice ?? 0 });
                            }}
                          >
                            {lineOptions.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </Select>
                        </td>
                        <td className="px-4 py-2.5">
                          <Input
                            type="number"
                            min={1}
                            value={line.qty}
                            onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) })}
                            className="text-right"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <Input
                            type="number"
                            value={line.unitPrice}
                            onChange={(e) => updateLine(line.id, { unitPrice: Number(e.target.value) })}
                            className="text-right"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right tabular font-medium">{kes(line.qty * line.unitPrice)}</td>
                        <td className="px-4 py-2.5">
                          <button onClick={() => removeLine(line.id)} className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[var(--muted-foreground)]">Subtotal</span>
              <span className="tabular">{kes(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[var(--muted-foreground)]">VAT (16%)</span>
              <span className="tabular">{kes(vat)}</span>
            </div>
            <div className="flex justify-between text-[15px] font-semibold pt-2 border-t border-[var(--border)]">
              <span>Total</span>
              <span className="tabular">{kes(total)}</span>
            </div>
            <div className="flex flex-col gap-2 pt-3">
              <Button variant="secondary" disabled={!lines.length} onClick={() => handleSave("Draft")}>
                Save as draft
              </Button>
              <Button variant="primary" disabled={!lines.length} onClick={() => handleSave("Sent")}>
                Save and send
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
