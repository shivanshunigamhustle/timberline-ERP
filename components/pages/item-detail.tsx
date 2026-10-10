"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductLineBadge, StatusBadge } from "@/components/ui/badge";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { ItemImage } from "@/components/ui/product-image";
import { PurchaseOrderModal } from "@/components/modals/purchase-order-modal";
import { EditItemSheet } from "@/components/modals/edit-item-sheet";
import { AdjustStockModal } from "@/components/modals/adjust-stock-modal";
import { useErpStore } from "@/lib/store";
import type { Item } from "@/lib/types";

export function ItemDetail({ item, basePath, role }: { item: Item; basePath: string; role: "owner" | "warehouse" }) {
  const router = useRouter();
  const allMovements = useErpStore((s) => s.stockMovements);
  const movements = allMovements.filter((m) => m.itemId === item.id);
  const [editOpen, setEditOpen] = useState(false);
  const [poOpen, setPoOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  const daysRemaining = item.avgMonthlyUsage > 0 ? Math.round((item.stockOnHand / item.avgMonthlyUsage) * 30) : 0;

  return (
    <div>
      <button
        onClick={() => router.push(basePath)}
        className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-3 transition-colors"
      >
        <ArrowLeft size={13} /> Back to stock overview
      </button>
      <PageHeader
        title={item.name}
        image={<ItemImage productLine={item.productLine} seed={item.id} size={56} />}
        description={
          <span className="inline-flex items-center gap-2">
            <ProductLineBadge line={item.productLine} />
            <StatusBadge status={item.status} />
          </span>
        }
        actions={
          role === "owner" ? (
            <>
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                Edit item
              </Button>
              <Button variant="primary" onClick={() => setPoOpen(true)}>
                Reorder now
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setAdjustOpen(true)}>
              Adjust stock
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Stock on hand</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">
            {item.stockOnHand} <span className="text-[13px] font-normal text-[var(--muted-foreground)]">{item.unit}</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Reorder point</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{item.reorderPoint}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Avg. monthly usage</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{item.avgMonthlyUsage}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Days of stock remaining</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{daysRemaining}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock movement</CardTitle>
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Type</TH>
              <TH>Quantity</TH>
              <TH>Balance after</TH>
              <TH>Note</TH>
            </tr>
          </THead>
          <tbody>
            {movements.map((m) => (
              <TRow key={m.id}>
                <TD className="text-[var(--muted-foreground)]">{m.date}</TD>
                <TD>
                  <StatusBadge status={m.type} />
                </TD>
                <TD className={`tabular font-medium ${m.quantity > 0 ? "text-[var(--brand-dark)]" : "text-[var(--accent-red)]"}`}>
                  {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                </TD>
                <TD className="tabular">{m.balanceAfter}</TD>
                <TD className="text-[var(--muted-foreground)]">{m.note}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <EditItemSheet item={item} open={editOpen} onClose={() => setEditOpen(false)} />
      <PurchaseOrderModal item={poOpen ? item : null} open={poOpen} onClose={() => setPoOpen(false)} />
      <AdjustStockModal item={item} open={adjustOpen} onClose={() => setAdjustOpen(false)} />
    </div>
  );
}
