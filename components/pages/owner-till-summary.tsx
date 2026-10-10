"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ProductLineBadge } from "@/components/ui/badge";
import { ReconcileTillModal } from "@/components/modals/till-modals";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Till } from "@/lib/types";

export function OwnerTillSummary() {
  const tills = useErpStore((s) => s.tills);
  const transactions = useErpStore((s) => s.tillTransactions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reconcileTill, setReconcileTill] = useState<Till | null>(null);

  const cashTotal = transactions.filter((t) => t.paymentMethod === "Cash").reduce((s, t) => s + t.amount, 0);
  const mpesaTotal = transactions.filter((t) => t.paymentMethod === "M-Pesa").reduce((s, t) => s + t.amount, 0);
  const expectedDeposit = cashTotal;
  const variance = 0;

  return (
    <div>
      <PageHeader title="Till summary" description="Cash and M-Pesa collection across every till, today." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Total cash collected (today)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(cashTotal)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Total M-Pesa collected (today)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(mpesaTotal)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Expected bank deposit</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(expectedDeposit)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Variance</p>
          <p className={cn("text-[19px] font-semibold tabular mt-1.5", variance === 0 ? "text-[var(--brand-dark)]" : "text-[var(--accent-red)]")}>
            {kes(variance)}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tills</CardTitle>
        </CardHeader>
        <div className="divide-y divide-[var(--border)]">
          {tills.map((till) => {
            const tillTx = transactions.filter((t) => t.tillId === till.id);
            const cash = tillTx.filter((t) => t.paymentMethod === "Cash").reduce((s, t) => s + t.amount, 0);
            const mpesa = tillTx.filter((t) => t.paymentMethod === "M-Pesa").reduce((s, t) => s + t.amount, 0);
            const expanded = expandedId === till.id;
            return (
              <div key={till.id}>
                <button
                  onClick={() => setExpandedId(expanded ? null : till.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div className="w-36 shrink-0">
                    <p className="text-[13.5px] font-medium">{till.name}</p>
                    <p className="text-[12px] text-[var(--muted-foreground)]">{till.cashierOnDuty}</p>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4 text-[13px]">
                    <span>Float: <span className="tabular font-medium">{kes(till.openingFloat)}</span></span>
                    <span>Cash: <span className="tabular font-medium">{kes(cash)}</span></span>
                    <span>M-Pesa: <span className="tabular font-medium">{kes(mpesa)}</span></span>
                  </div>
                  <StatusBadge status={till.status} />
                  {till.status === "Closed" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReconcileTill(till);
                      }}
                    >
                      Reconcile
                    </Button>
                  )}
                </button>
                {expanded && (
                  <CardBody className="bg-[var(--surface-muted)] pt-0">
                    {tillTx.length === 0 ? (
                      <p className="text-[12.5px] text-[var(--muted-foreground)] py-3">No transactions yet.</p>
                    ) : (
                      <ul className="divide-y divide-[var(--border)]">
                        {tillTx.map((t) => (
                          <li key={t.id} className="flex items-center justify-between py-2.5 text-[12.5px]">
                            <span className="w-14 text-[var(--muted-foreground)]">{t.time}</span>
                            <span className="flex-1">{t.customerName}</span>
                            <ProductLineBadge line={t.productLine} />
                            <span className="w-28 text-right tabular font-medium">{kes(t.amount)}</span>
                            <span className="w-28 text-right text-[var(--muted-foreground)]">{t.paymentMethod}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardBody>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {reconcileTill && <ReconcileTillModal till={reconcileTill} open onClose={() => setReconcileTill(null)} />}
    </div>
  );
}
