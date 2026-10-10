"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, ProductLineBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/field";
import { SearchInput } from "@/components/ui/search-input";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import { toast } from "@/lib/toast-store";
import type { LedgerType, ProductLine } from "@/lib/types";

export function TransactionsLedger() {
  const entries = useErpStore((s) => s.ledgerEntries);
  const [type, setType] = useState<"All" | LedgerType>("All");
  const [line, setLine] = useState<"All" | ProductLine>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      entries.filter((e) => {
        if (type !== "All" && e.type !== type) return false;
        if (line !== "All" && e.productLine !== line) return false;
        if (search && !`${e.description} ${e.reference}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [entries, type, line, search]
  );

  return (
    <div>
      <PageHeader
        title="Transactions ledger"
        description="Double-entry style record of everything that moved money."
        actions={
          <Button variant="secondary" onClick={() => toast("Export ready")}>
            <Download size={14} /> Export filtered view
          </Button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border)]">
          <Select className="w-auto" value={type} onChange={(e) => setType(e.target.value as "All" | LedgerType)}>
            <option value="All">All types</option>
            <option value="Sale">Sale</option>
            <option value="Purchase">Purchase</option>
            <option value="Expense">Expense</option>
            <option value="Payment">Payment</option>
          </Select>
          <Select className="w-auto" value={line} onChange={(e) => setLine(e.target.value as "All" | ProductLine)}>
            <option value="All">All product lines</option>
            <option value="Timber">Timber</option>
            <option value="Gas">Gas</option>
            <option value="Bio-products">Bio-products</option>
          </Select>
          <div className="ml-auto">
            <SearchInput value={search} onChange={setSearch} placeholder="Search description or reference" />
          </div>
        </div>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Reference</TH>
              <TH>Description</TH>
              <TH>Product line</TH>
              <TH>Debit</TH>
              <TH>Credit</TH>
              <TH>Running balance</TH>
            </tr>
          </THead>
          <tbody>
            {filtered.map((e) => (
              <TRow key={e.id}>
                <TD className="text-[var(--muted-foreground)]">{e.date}</TD>
                <TD className="font-medium">{e.reference}</TD>
                <TD>{e.description}</TD>
                <TD>{e.productLine ? <ProductLineBadge line={e.productLine} /> : <Badge tone="slate">—</Badge>}</TD>
                <TD className="tabular">{e.debit ? kes(e.debit) : "—"}</TD>
                <TD className="tabular">{e.credit ? kes(e.credit) : "—"}</TD>
                <TD className="tabular font-medium">{kes(e.runningBalance)}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
