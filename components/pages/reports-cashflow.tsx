"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { CashFlowChart } from "@/components/charts/cash-flow-chart";
import { CASH_FLOW_MONTHLY, kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";

const CATEGORY_OF: Record<string, string> = {
  Sale: "Sales",
  Payment: "Sales",
  Purchase: "Supplier payment",
  Expense: "Fuel",
};

export function ReportsCashFlow() {
  const ledger = useErpStore((s) => s.ledgerEntries);
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const current = CASH_FLOW_MONTHLY[CASH_FLOW_MONTHLY.length - 1];

  const transactions = useMemo(
    () =>
      ledger.map((e) => ({
        ...e,
        flowType: e.credit > 0 ? "Inflow" : "Outflow",
        category: CATEGORY_OF[e.type] ?? "Other",
        amount: e.credit > 0 ? e.credit : e.debit,
      })),
    [ledger]
  );

  const filtered = transactions.filter((t) => {
    if (typeFilter !== "All" && t.flowType !== typeFilter) return false;
    if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Cash flow" description="What came in, what went out, and the net movement." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Cash in (this month)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(current.inflow)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Cash out (this month)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(current.outflow)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Net cash flow</p>
          <p className="text-[19px] font-semibold tabular mt-1.5 text-[var(--brand-dark)]">{kes(current.inflow - current.outflow)}</p>
        </Card>
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Inflow vs. outflow</CardTitle>
          <span className="text-[12px] text-[var(--muted-foreground)]">Last 6 months</span>
        </CardHeader>
        <CardBody>
          <CashFlowChart data={CASH_FLOW_MONTHLY} />
        </CardBody>
      </Card>

      <Card>
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border)]">
          <Select className="w-auto" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All types</option>
            <option value="Inflow">Inflow</option>
            <option value="Outflow">Outflow</option>
          </Select>
          <Select className="w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All categories</option>
            <option value="Sales">Sales</option>
            <option value="Supplier payment">Supplier payment</option>
            <option value="Fuel">Fuel</option>
            <option value="Payroll">Payroll</option>
            <option value="Other">Other</option>
          </Select>
        </div>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Description</TH>
              <TH>Type</TH>
              <TH>Category</TH>
              <TH>Amount</TH>
            </tr>
          </THead>
          <tbody>
            {filtered.map((t) => (
              <TRow key={t.id}>
                <TD className="text-[var(--muted-foreground)]">{t.date}</TD>
                <TD className="font-medium">{t.description}</TD>
                <TD>
                  <Badge tone={t.flowType === "Inflow" ? "green" : "red"}>{t.flowType}</Badge>
                </TD>
                <TD className="text-[var(--muted-foreground)]">{t.category}</TD>
                <TD className="tabular font-medium">{kes(t.amount)}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
