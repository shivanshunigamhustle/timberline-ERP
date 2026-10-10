"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { ItemImage } from "@/components/ui/product-image";
import { RevenueCostTrendChart } from "@/components/charts/revenue-cost-trend-chart";
import { LINE_COLORS } from "@/components/charts/profit-by-line-chart";
import { PRODUCT_LINE_MONTHLY, kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { ProductLine } from "@/lib/types";

const EXTRA_STAT: Partial<Record<ProductLine, { label: string; value: string }>> = {
  Gas: { label: "Cylinders in circulation", value: "1,284" },
};

export function ProductLinePage({ productLine }: { productLine: ProductLine }) {
  const router = useRouter();
  const allItems = useErpStore((s) => s.items);
  const items = allItems.filter((i) => i.productLine === productLine);

  const monthly = useMemo(() => PRODUCT_LINE_MONTHLY.filter((d) => d.productLine === productLine), [productLine]);
  const current = monthly[monthly.length - 1];
  const margin = current ? Math.round((current.profit / current.revenue) * 100) : 0;
  const extra = EXTRA_STAT[productLine];

  return (
    <div>
      <PageHeader
        title={productLine}
        description="Revenue, cost and items scoped to this product line only."
        actions={
          <Button variant="secondary" onClick={() => router.push(`/owner/inventory?line=${productLine}`)}>
            Manage items
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Revenue (this month)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(current?.revenue ?? 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Cost of goods</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(current?.cost ?? 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Gross profit</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(current?.profit ?? 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">{extra ? extra.label : "Margin %"}</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{extra ? extra.value : `${margin}%`}</p>
        </Card>
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Revenue vs. cost</CardTitle>
          <span className="text-[12px] text-[var(--muted-foreground)]">Last 6 months</span>
        </CardHeader>
        <CardBody>
          <RevenueCostTrendChart data={monthly} color={LINE_COLORS[productLine]} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{productLine} items</CardTitle>
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Item</TH>
              <TH>Unit</TH>
              <TH>Stock on hand</TH>
              <TH>Reorder point</TH>
              <TH>Unit price</TH>
              <TH>Status</TH>
            </tr>
          </THead>
          <tbody>
            {items.map((item) => (
              <TRow key={item.id} onClick={() => router.push(`/owner/inventory/${item.id}`)}>
                <TD className="font-medium">
                  <div className="flex items-center gap-3">
                    <ItemImage productLine={productLine} seed={item.id} size={30} />
                    {item.name}
                  </div>
                </TD>
                <TD className="text-[var(--muted-foreground)]">{item.unit}</TD>
                <TD className="tabular">{item.stockOnHand}</TD>
                <TD className="tabular text-[var(--muted-foreground)]">{item.reorderPoint}</TD>
                <TD className="tabular">{kes(item.unitPrice)}</TD>
                <TD>
                  <StatusBadge status={item.status} />
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
