"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductLineBadge, StatusBadge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemImage } from "@/components/ui/product-image";
import { PurchaseOrderModal } from "@/components/modals/purchase-order-modal";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { Item, ItemStatus, ProductLine } from "@/lib/types";

export function StockOverview({ basePath, role }: { basePath: string; role: "owner" | "warehouse" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const items = useErpStore((s) => s.items);
  const reorderQueue = useErpStore((s) => s.reorderQueue);
  const markReorderReceived = useErpStore((s) => s.markReorderReceived);
  const flagForReorder = useErpStore((s) => s.flagForReorder);

  const initialLine = (searchParams.get("line") as ProductLine | null) ?? "All";
  const initialStatus = (searchParams.get("status") as ItemStatus | null) ?? "All";

  const [productLine, setProductLine] = useState<"All" | ProductLine>(initialLine);
  const [status, setStatus] = useState<"All" | ItemStatus>(initialStatus);
  const [search, setSearch] = useState("");
  const [poItem, setPoItem] = useState<Item | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        if (productLine !== "All" && it.productLine !== productLine) return false;
        if (status !== "All" && it.status !== status) return false;
        if (search && !it.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [items, productLine, status, search]
  );

  const queueWithItems = reorderQueue
    .filter((r) => r.status === "Ordered")
    .map((r) => ({ ...r, item: items.find((i) => i.id === r.itemId) }));

  return (
    <div>
      <PageHeader title="Stock overview" description="Everything in stock across timber, gas and bio-products." />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        <Card>
          <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border)]">
            <Select className="w-auto" value={productLine} onChange={(e) => setProductLine(e.target.value as "All" | ProductLine)}>
              <option value="All">All product lines</option>
              <option value="Timber">Timber</option>
              <option value="Gas">Gas</option>
              <option value="Bio-products">Bio-products</option>
            </Select>
            <Select className="w-auto" value={status} onChange={(e) => setStatus(e.target.value as "All" | ItemStatus)}>
              <option value="All">All statuses</option>
              <option value="In stock">In stock</option>
              <option value="Low">Low</option>
              <option value="Reorder">Reorder</option>
              <option value="On order">On order</option>
            </Select>
            <div className="ml-auto">
              <SearchInput value={search} onChange={setSearch} placeholder="Search item name" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Package} title="No items match" description="Try widening your filters." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <TH>Item</TH>
                  <TH>Product line</TH>
                  <TH>Stock on hand</TH>
                  <TH>Reorder point</TH>
                  <TH>Status</TH>
                  <TH>Last restocked</TH>
                  <TH />
                </tr>
              </THead>
              <tbody>
                {filtered.map((item) => (
                  <TRow key={item.id} onClick={() => router.push(`${basePath}/${item.id}`)}>
                    <TD className="font-medium">
                      <div className="flex items-center gap-3">
                        <ItemImage productLine={item.productLine} seed={item.id} size={22} />
                        {item.name}
                      </div>
                    </TD>
                    <TD>
                      <ProductLineBadge line={item.productLine} />
                    </TD>
                    <TD className="tabular">
                      {item.stockOnHand} {item.unit}
                    </TD>
                    <TD className="tabular text-[var(--muted-foreground)]">{item.reorderPoint}</TD>
                    <TD>
                      <StatusBadge status={item.status} />
                    </TD>
                    <TD className="text-[var(--muted-foreground)]">{item.lastRestocked}</TD>
                    <TD>
                      {(item.status === "Low" || item.status === "Reorder") &&
                        (role === "owner" ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPoItem(item);
                            }}
                          >
                            Reorder
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={item.status === "Reorder"}
                            onClick={(e) => {
                              e.stopPropagation();
                              flagForReorder(item.id);
                            }}
                          >
                            Flag for reorder
                          </Button>
                        ))}
                    </TD>
                  </TRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reorder queue</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            {queueWithItems.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-[var(--muted-foreground)]">Nothing on order right now.</p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {queueWithItems.map((entry) => (
                  <li key={entry.id} className="px-5 py-3.5">
                    <p className="text-[13.5px] font-medium">{entry.item?.name}</p>
                    <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5 mb-2.5">
                      Expected {entry.expectedDelivery} &middot; {entry.qtyToOrder} {entry.item?.unit}
                    </p>
                    <Button size="sm" variant="secondary" onClick={() => markReorderReceived(entry.id)}>
                      Mark received
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <PurchaseOrderModal item={poItem} open={!!poItem} onClose={() => setPoItem(null)} />
    </div>
  );
}
