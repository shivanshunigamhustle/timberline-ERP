"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductLineBadge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { InvoiceStatus, ProductLine } from "@/lib/types";

export function InvoicesList({ basePath, readOnly = false }: { basePath: string; readOnly?: boolean }) {
  const router = useRouter();
  const invoices = useErpStore((s) => s.invoices);
  const markInvoicePaid = useErpStore((s) => s.markInvoicePaid);

  const [productLine, setProductLine] = useState<"All" | ProductLine>("All");
  const [status, setStatus] = useState<"All" | InvoiceStatus>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      invoices.filter((inv) => {
        if (productLine !== "All" && inv.productLine !== productLine) return false;
        if (status !== "All" && inv.status !== status) return false;
        if (search && !`${inv.customerName} ${inv.invoiceNumber}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [invoices, productLine, status, search]
  );

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={readOnly ? "Read-only view of Timberline's invoices." : "Every invoice across all three product lines."}
        actions={!readOnly && <Button variant="primary" onClick={() => router.push(`${basePath}/new`)}><Plus size={14} /> New Invoice</Button>}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border)]">
          <Select className="w-auto" value={productLine} onChange={(e) => setProductLine(e.target.value as "All" | ProductLine)}>
            <option value="All">All product lines</option>
            <option value="Timber">Timber</option>
            <option value="Gas">Gas</option>
            <option value="Bio-products">Bio-products</option>
          </Select>
          <Select className="w-auto" value={status} onChange={(e) => setStatus(e.target.value as "All" | InvoiceStatus)}>
            <option value="All">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </Select>
          <div className="ml-auto">
            <SearchInput value={search} onChange={setSearch} placeholder="Search customer or invoice #" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No invoices match" description="Try widening your filters." />
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Invoice #</TH>
                <TH>Customer</TH>
                <TH>Product line</TH>
                <TH>Amount</TH>
                <TH>KRA eTIMS</TH>
                <TH>Status</TH>
                <TH>Date</TH>
                {!readOnly && <TH />}
              </tr>
            </THead>
            <tbody>
              {filtered.map((inv) => (
                <TRow key={inv.id} onClick={() => router.push(`${basePath}/${inv.id}`)}>
                  <TD className="font-medium">{inv.invoiceNumber}</TD>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={inv.customerName} size={26} />
                      {inv.customerName}
                    </div>
                  </TD>
                  <TD>
                    <ProductLineBadge line={inv.productLine} />
                  </TD>
                  <TD className="tabular">{kes(inv.amount + inv.vatAmount)}</TD>
                  <TD>
                    <StatusBadge status={inv.etimsStatus} />
                  </TD>
                  <TD>
                    <StatusBadge status={inv.status} />
                  </TD>
                  <TD className="text-[var(--muted-foreground)]">{inv.issueDate}</TD>
                  {!readOnly && (
                    <TD>
                      {(inv.status === "Sent" || inv.status === "Overdue") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markInvoicePaid(inv.id);
                          }}
                          title="Mark as paid"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </TD>
                  )}
                </TRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
