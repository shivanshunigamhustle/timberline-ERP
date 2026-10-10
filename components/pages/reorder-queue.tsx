"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductLineBadge, StatusBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { ClipboardList } from "lucide-react";
import { useErpStore } from "@/lib/store";

export function ReorderQueuePage() {
  const reorderQueue = useErpStore((s) => s.reorderQueue);
  const items = useErpStore((s) => s.items);
  const submitOrder = useErpStore((s) => s.submitOrder);
  const markReorderReceived = useErpStore((s) => s.markReorderReceived);

  const rows = reorderQueue.map((r) => ({ ...r, item: items.find((i) => i.id === r.itemId) }));

  return (
    <div>
      <PageHeader title="Reorder queue" description="Everything flagged, ordered or received for restock." />
      <Card>
        {rows.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Queue is empty" description="Flag items for reorder from Stock overview." />
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Item</TH>
                <TH>Product line</TH>
                <TH>Qty to order</TH>
                <TH>Preferred supplier</TH>
                <TH>Status</TH>
                <TH />
              </tr>
            </THead>
            <tbody>
              {rows.map((r) => (
                <TRow key={r.id}>
                  <TD className="font-medium">{r.item?.name}</TD>
                  <TD>{r.item && <ProductLineBadge line={r.item.productLine} />}</TD>
                  <TD>
                    <Input
                      type="number"
                      defaultValue={r.qtyToOrder}
                      className="w-24 h-8"
                      disabled={r.status !== "Flagged"}
                    />
                  </TD>
                  <TD className="text-[var(--muted-foreground)]">{r.preferredSupplier}</TD>
                  <TD>
                    <StatusBadge status={r.status} />
                  </TD>
                  <TD>
                    {r.status === "Flagged" && (
                      <Button size="sm" variant="primary" onClick={() => submitOrder(r.id)}>
                        Submit order
                      </Button>
                    )}
                    {r.status === "Ordered" && (
                      <Button size="sm" variant="secondary" onClick={() => markReorderReceived(r.id)}>
                        Mark received
                      </Button>
                    )}
                  </TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
