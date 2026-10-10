"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/field";
import { ItemImage } from "@/components/ui/product-image";
import { ITEMS, kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { PaymentMethod, ProductLine } from "@/lib/types";

const LINES: ProductLine[] = ["Timber", "Gas", "Bio-products"];
const METHODS: PaymentMethod[] = ["Cash", "M-Pesa", "Bank transfer"];
const TILL_ID = "till-1";

interface CartLine {
  itemId: string;
  name: string;
  unitPrice: number;
  qty: number;
  productLine: ProductLine;
}

export function NewSale() {
  const router = useRouter();
  const completeSale = useErpStore((s) => s.completeSale);
  const [tab, setTab] = useState<ProductLine>("Timber");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [customerName, setCustomerName] = useState("");

  const items = ITEMS.filter((i) => i.productLine === tab);

  function addToCart(itemId: string) {
    const item = ITEMS.find((i) => i.id === itemId)!;
    setCart((prev) => {
      const existing = prev.find((l) => l.itemId === itemId);
      if (existing) return prev.map((l) => (l.itemId === itemId ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { itemId: item.id, name: item.name, unitPrice: item.unitPrice, qty: 1, productLine: item.productLine }];
    });
  }

  function updateQty(itemId: string, delta: number) {
    setCart((prev) =>
      prev.map((l) => (l.itemId === itemId ? { ...l, qty: Math.max(1, l.qty + delta) } : l)).filter((l) => l.qty > 0)
    );
  }

  function removeLine(itemId: string) {
    setCart((prev) => prev.filter((l) => l.itemId !== itemId));
  }

  const subtotal = cart.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  function handleComplete() {
    completeSale(TILL_ID, cart, method, customerName);
    setCart([]);
    setCustomerName("");
    router.push("/cashier/till");
  }

  return (
    <div>
      <PageHeader title="New Sale" description="Tap items to add them to the order." />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
        <Card className="p-5">
          <Tabs tabs={LINES} value={tab} onChange={setTab} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item.id)}
                className="overflow-hidden rounded-[10px] border border-[var(--border)] text-left transition-all duration-150 hover:border-[var(--brand)]/50 hover:shadow-[var(--shadow-sm)] active:scale-[0.98]"
              >
                <ItemImage productLine={item.productLine} seed={item.id} size={400} className="w-full h-24 rounded-none" />
                <div className="p-3">
                  <p className="text-[13.5px] font-medium leading-5">{item.name}</p>
                  <p className="text-[12.5px] text-[var(--muted-foreground)] mt-1">{item.unit}</p>
                  <p className="text-[14px] font-semibold tabular mt-1.5">{kes(item.unitPrice)}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 sticky top-0">
          <p className="text-[13.5px] font-semibold mb-3">Order summary</p>
          <Input
            placeholder="Customer name (optional — Walk-in)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mb-3.5"
          />
          {cart.length === 0 ? (
            <p className="text-[12.5px] text-[var(--muted-foreground)] py-6 text-center">No items added yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--border)] mb-3.5 max-h-72 overflow-y-auto">
              {cart.map((line) => (
                <li key={line.itemId} className="py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12.5px] font-medium leading-4">{line.name}</p>
                    <button onClick={() => removeLine(line.itemId)} className="text-[var(--muted-foreground)] hover:text-[var(--accent-red)] transition-colors shrink-0">
                      <X size={13} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(line.itemId, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--surface-muted)]"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-5 text-center text-[12.5px] tabular">{line.qty}</span>
                      <button
                        onClick={() => updateQty(line.itemId, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--surface-muted)]"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="text-[12.5px] font-semibold tabular">{kes(line.qty * line.unitPrice)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-1.5 border-t border-[var(--border)] pt-3">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-[var(--muted-foreground)]">Subtotal</span>
              <span className="tabular">{kes(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[12.5px]">
              <span className="text-[var(--muted-foreground)]">VAT (16%)</span>
              <span className="tabular">{kes(vat)}</span>
            </div>
            <div className="flex justify-between text-[15px] font-semibold">
              <span>Total</span>
              <span className="tabular">{kes(total)}</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[12px] text-[var(--muted-foreground)] mb-1.5">Payment method</p>
            <div className="grid grid-cols-3 gap-1.5">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`h-8 rounded-[8px] text-[12px] font-medium border transition-colors ${
                    method === m ? "bg-[var(--brand)] border-[var(--brand)] text-white" : "border-[var(--border)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" className="w-full h-11 mt-4" disabled={cart.length === 0} onClick={handleComplete}>
            Complete sale
          </Button>
        </Card>
      </div>
    </div>
  );
}
