"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Banknote, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FilterPills } from "@/components/ui/filter-pill";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductLineBadge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ProfitByLineChart } from "@/components/charts/profit-by-line-chart";
import { PurchaseOrderModal } from "@/components/modals/purchase-order-modal";
import { PRODUCT_LINE_MONTHLY, kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { Item, ProductLine } from "@/lib/types";

type LineFilter = "All" | ProductLine;
const FILTERS: LineFilter[] = ["All", "Timber", "Gas", "Bio-products"];

export function OwnerDashboard() {
  const router = useRouter();
  const [filter, setFilter] = useState<LineFilter>("All");
  const items = useErpStore((s) => s.items);
  const tills = useErpStore((s) => s.tills);
  const tillTransactions = useErpStore((s) => s.tillTransactions);
  const trucks = useErpStore((s) => s.trucks);
  const [poItem, setPoItem] = useState<Item | null>(null);

  const chartData = useMemo(
    () => (filter === "All" ? PRODUCT_LINE_MONTHLY : PRODUCT_LINE_MONTHLY.filter((d) => d.productLine === filter)),
    [filter]
  );

  const octoberRows = PRODUCT_LINE_MONTHLY.filter((d) => d.month === "Oct" && (filter === "All" || d.productLine === filter));
  const septemberRows = PRODUCT_LINE_MONTHLY.filter((d) => d.month === "Sep" && (filter === "All" || d.productLine === filter));

  const revenueTotal = octoberRows.reduce((s, r) => s + r.revenue, 0);
  const profitTotal = octoberRows.reduce((s, r) => s + r.profit, 0);
  const profitLastMonth = septemberRows.reduce((s, r) => s + r.profit, 0);
  const profitDeltaPct = profitLastMonth ? Math.round(((profitTotal - profitLastMonth) / profitLastMonth) * 100) : 0;

  const cashInTill = tills.reduce((s, t) => s + t.openingFloat, 0) + tillTransactions.reduce((s, t) => s + t.amount, 0);

  const lowStockItems = items.filter((i) => i.status === "Low" || i.status === "Reorder").filter((i) => filter === "All" || i.productLine === filter);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A single, honest view of profit per product line."
        actions={<FilterPills options={FILTERS} value={filter} onChange={setFilter} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Revenue (this month)"
          value={kes(revenueTotal)}
          icon={<TrendingUp size={15} />}
          onClick={() => router.push("/owner/reports/profit")}
          sub={
            <div className="flex flex-col gap-0.5">
              {octoberRows.map((r) => (
                <div key={r.productLine} className="flex justify-between gap-3">
                  <span className="whitespace-nowrap">{r.productLine}</span>
                  <span className="tabular whitespace-nowrap">{kes(r.revenue)}</span>
                </div>
              ))}
            </div>
          }
        />
        <StatCard
          label="Net profit (this month)"
          value={kes(profitTotal)}
          delta={`${profitDeltaPct >= 0 ? "+" : ""}${profitDeltaPct}% vs last month`}
          deltaTone={profitDeltaPct >= 0 ? "green" : "red"}
          icon={<TrendingUp size={15} />}
          onClick={() => router.push("/owner/reports/profit")}
        />
        <StatCard
          label="Cash in till (today)"
          value={kes(cashInTill)}
          icon={<Wallet size={15} />}
          onClick={() => router.push("/owner/cash/till")}
          sub={`${tills.filter((t) => t.status === "Open").length} till(s) open`}
        />
        <StatCard
          label="Low-stock items"
          value={String(lowStockItems.length)}
          icon={<AlertTriangle size={15} />}
          highlight={lowStockItems.length > 0 ? "red" : undefined}
          onClick={() => router.push("/owner/inventory?status=Low")}
          sub={lowStockItems.length > 0 ? "Needs reorder attention" : "All lines healthy"}
        />
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Profit by product line</CardTitle>
          <span className="text-[12px] text-[var(--muted-foreground)]">Last 6 months</span>
        </CardHeader>
        <CardBody>
          <ProfitByLineChart data={chartData} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Low-stock alerts</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            {lowStockItems.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-[var(--muted-foreground)]">Nothing below reorder point right now.</p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {lowStockItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-medium truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <ProductLineBadge line={item.productLine} />
                        <span className="text-[12px] text-[var(--muted-foreground)]">
                          {item.stockOnHand} {item.unit} left
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => setPoItem(item)}>
                      Reorder
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet status</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-3">
            {trucks.map((truck) => (
              <button
                key={truck.id}
                onClick={() => router.push(`/owner/fleet/${truck.id}`)}
                className="flex items-center justify-between rounded-[10px] border border-[var(--border)] px-4 py-3 text-left transition-colors hover:bg-[var(--surface-muted)]"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={truck.assignedDriver} size={34} />
                  <div>
                    <p className="text-[13.5px] font-semibold">{truck.registration}</p>
                    <p className="text-[12.5px] text-[var(--muted-foreground)] mt-0.5">{truck.assignedDriver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={truck.status} />
                  <p className="text-[11.5px] text-[var(--muted-foreground)] mt-1.5">
                    <Banknote size={11} className="inline -mt-0.5 mr-1" />
                    {kes(truck.monthlyRunningCost)}/mo
                  </p>
                </div>
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      <PurchaseOrderModal item={poItem} open={!!poItem} onClose={() => setPoItem(null)} />
    </div>
  );
}
