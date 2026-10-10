"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RevenueCostTrendChart } from "@/components/charts/revenue-cost-trend-chart";
import { PRODUCT_LINE_MONTHLY, kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";

export function AccountantDashboard() {
  const router = useRouter();
  const invoices = useErpStore((s) => s.invoices);
  const tills = useErpStore((s) => s.tills);
  const tillTransactions = useErpStore((s) => s.tillTransactions);

  const revenueYtd = PRODUCT_LINE_MONTHLY.reduce((s, r) => s + r.revenue, 0);
  const profitYtd = PRODUCT_LINE_MONTHLY.reduce((s, r) => s + r.profit, 0);
  const outstanding = invoices.filter((i) => i.status === "Sent" || i.status === "Overdue");
  const outstandingAmount = outstanding.reduce((s, i) => s + i.amount + i.vatAmount, 0);
  const cashToday = tills.reduce((s, t) => s + t.openingFloat, 0) + tillTransactions.reduce((s, t) => s + t.amount, 0);

  const combined = useMemo(
    () =>
      Array.from(new Set(PRODUCT_LINE_MONTHLY.map((d) => d.month))).map((month) => {
        const entries = PRODUCT_LINE_MONTHLY.filter((d) => d.month === month);
        const revenue = entries.reduce((s, e) => s + e.revenue, 0);
        const cost = entries.reduce((s, e) => s + e.cost, 0);
        return { month, revenue, cost, profit: revenue - cost };
      }),
    []
  );

  return (
    <div>
      <div className="flex items-center gap-2.5 rounded-[10px] bg-[var(--brand-light)] text-[var(--brand-dark)] px-4 py-3 mb-5 text-[13px]">
        <ShieldCheck size={16} />
        You&apos;re viewing Timberline Traders&apos; books — read access as Accountant.
      </div>

      <PageHeader
        title="Financial dashboard"
        actions={
          <Button variant="primary" onClick={() => router.push("/accountant/statements")}>
            Go to Financial Statements
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Revenue (YTD)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(revenueYtd)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Net profit (YTD)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(profitYtd)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Outstanding invoices</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">
            {outstanding.length} <span className="text-[13px] font-normal text-[var(--muted-foreground)]">&middot; {kes(outstandingAmount)}</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Cash position (today)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(cashToday)}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs. expenses</CardTitle>
          <span className="text-[12px] text-[var(--muted-foreground)]">Last 12 months (sample: 6 shown)</span>
        </CardHeader>
        <CardBody>
          <RevenueCostTrendChart data={combined} />
        </CardBody>
      </Card>
    </div>
  );
}
