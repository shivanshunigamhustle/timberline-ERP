"use client";

import { Fragment, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge, StatusBadge, ProductLineBadge } from "@/components/ui/badge";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";

const HISTORY = [
  { id: "h1", date: "2026-10-09", openingFloat: 5000, cash: 42300, mpesa: 61800, countedCash: 47100, variance: "Balanced" as const, status: "Reconciled" as const },
  { id: "h2", date: "2026-10-08", openingFloat: 5000, cash: 38900, mpesa: 55200, countedCash: 44200, variance: "Over" as const, status: "Reconciled" as const },
  { id: "h3", date: "2026-10-07", openingFloat: 5000, cash: 51200, mpesa: 48700, countedCash: 55600, variance: "Short" as const, status: "Reconciled" as const },
];

export function TillHistory() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const transactions = useErpStore((s) => s.tillTransactions);

  return (
    <div>
      <PageHeader title="Till history" description="Past closes and their reconciliation outcome." />
      <Card>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Opening float</TH>
              <TH>Cash collected</TH>
              <TH>M-Pesa collected</TH>
              <TH>Counted cash</TH>
              <TH>Variance</TH>
              <TH>Status</TH>
            </tr>
          </THead>
          <tbody>
            {HISTORY.map((h) => {
              const expanded = expandedId === h.id;
              return (
                <Fragment key={h.id}>
                  <TRow onClick={() => setExpandedId(expanded ? null : h.id)}>
                    <TD className="font-medium">{h.date}</TD>
                    <TD className="tabular">{kes(h.openingFloat)}</TD>
                    <TD className="tabular">{kes(h.cash)}</TD>
                    <TD className="tabular">{kes(h.mpesa)}</TD>
                    <TD className="tabular">{kes(h.countedCash)}</TD>
                    <TD>
                      <StatusBadge status={h.variance} />
                    </TD>
                    <TD>
                      <StatusBadge status={h.status} />
                    </TD>
                  </TRow>
                  {expanded && (
                    <tr>
                      <td colSpan={7} className="bg-[var(--surface-muted)] px-4 py-3">
                        <CardBody className="p-0">
                          <ul className="divide-y divide-[var(--border)]">
                            {transactions.slice(0, 4).map((t) => (
                              <li key={t.id} className="flex items-center justify-between py-2 text-[12.5px]">
                                <span className="w-14 text-[var(--muted-foreground)]">{t.time}</span>
                                <span className="flex-1">{t.customerName}</span>
                                <ProductLineBadge line={t.productLine} />
                                <span className="w-24 text-right tabular font-medium">{kes(t.amount)}</span>
                                <Badge tone="slate">{t.paymentMethod}</Badge>
                              </li>
                            ))}
                          </ul>
                        </CardBody>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
