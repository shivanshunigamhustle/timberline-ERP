"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { StackedRevenueChart } from "@/components/charts/stacked-revenue-chart";
import { LINE_COLORS } from "@/components/charts/profit-by-line-chart";
import { PRODUCT_LINE_MONTHLY, kes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast-store";
import type { ProductLine } from "@/lib/types";

const RANGE_OPTIONS = ["This month", "Last month", "This quarter", "Year to date"];
const PRODUCT_LINES: ProductLine[] = ["Timber", "Gas", "Bio-products"];

export function ReportsProfit() {
  const [range, setRange] = useState(RANGE_OPTIONS[0]);
  const [focusLine, setFocusLine] = useState<ProductLine | null>(null);

  const monthsIncluded = useMemo(
    () =>
      range === "This month"
        ? ["Oct"]
        : range === "Last month"
        ? ["Sep"]
        : range === "This quarter"
        ? ["Aug", "Sep", "Oct"]
        : ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    [range]
  );

  const rows = useMemo(
    () =>
      PRODUCT_LINES.map((line) => {
        const entries = PRODUCT_LINE_MONTHLY.filter((d) => d.productLine === line && monthsIncluded.includes(d.month));
        const revenue = entries.reduce((s, e) => s + e.revenue, 0);
        const cost = entries.reduce((s, e) => s + e.cost, 0);
        const profit = revenue - cost;
        const operatingCosts = Math.round(revenue * 0.08);
        const netProfit = profit - operatingCosts;
        return { line, revenue, cost, profit, operatingCosts, netProfit, margin: revenue ? Math.round((profit / revenue) * 100) : 0 };
      }),
    [monthsIncluded]
  );

  const detailRows = focusLine ? rows.filter((r) => r.line === focusLine) : rows;
  const chartData = useMemo(() => PRODUCT_LINE_MONTHLY.filter((d) => monthsIncluded.includes(d.month)), [monthsIncluded]);

  return (
    <div>
      <PageHeader
        title="Profit by product line"
        description="Compare Timber, Gas and Bio-products honestly — no blended number."
        actions={
          <>
            <Select className="w-auto" value={range} onChange={(e) => setRange(e.target.value)}>
              {RANGE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
            <Button variant="secondary" onClick={() => toast("Report exported")}>
              Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {rows.map((r) => (
          <button key={r.line} onClick={() => setFocusLine(focusLine === r.line ? null : r.line)} className="text-left">
            <Card
              className={cn(
                "p-4 transition-all duration-150",
                focusLine === r.line ? "border-[var(--brand)] shadow-[var(--shadow-md)]" : "hover:shadow-[var(--shadow-md)]"
              )}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: LINE_COLORS[r.line] }} />
                <span className="text-[13.5px] font-semibold">{r.line}</span>
              </div>
              <div className="space-y-1 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Revenue</span>
                  <span className="tabular font-medium">{kes(r.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">COGS</span>
                  <span className="tabular font-medium">{kes(r.cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Gross profit</span>
                  <span className="tabular font-medium">{kes(r.profit)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Margin</span>
                  <span className="tabular font-semibold">{r.margin}%</span>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Revenue by product line</CardTitle>
        </CardHeader>
        <CardBody>
          <StackedRevenueChart data={chartData} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detail</CardTitle>
          {focusLine && (
            <button onClick={() => setFocusLine(null)} className="text-[12px] text-[var(--brand-dark)] font-medium">
              Clear filter
            </button>
          )}
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Product line</TH>
              <TH>Revenue</TH>
              <TH>COGS</TH>
              <TH>Gross profit</TH>
              <TH>Operating costs</TH>
              <TH>Net profit</TH>
              <TH>Margin %</TH>
            </tr>
          </THead>
          <tbody>
            {detailRows.map((r) => (
              <TRow key={r.line}>
                <TD className="font-medium">{r.line}</TD>
                <TD className="tabular">{kes(r.revenue)}</TD>
                <TD className="tabular">{kes(r.cost)}</TD>
                <TD className="tabular">{kes(r.profit)}</TD>
                <TD className="tabular text-[var(--muted-foreground)]">{kes(r.operatingCosts)}</TD>
                <TD className="tabular font-medium">{kes(r.netProfit)}</TD>
                <TD className="tabular">{r.margin}%</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
