"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { LogBankDepositModal } from "@/components/modals/log-bank-deposit-modal";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";

export function BankReconciliation() {
  const deposits = useErpStore((s) => s.bankDeposits);
  const [logOpen, setLogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Bank reconciliation"
        description="Deposits logged against what the tills collected."
        actions={
          <Button variant="primary" onClick={() => setLogOpen(true)}>
            <Plus size={14} /> Log bank deposit
          </Button>
        }
      />

      <Card>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Amount</TH>
              <TH>Bank</TH>
              <TH>Reference</TH>
              <TH>Matched till total</TH>
              <TH>Status</TH>
            </tr>
          </THead>
          <tbody>
            {deposits.map((d) => (
              <TRow key={d.id}>
                <TD className="text-[var(--muted-foreground)]">{d.date}</TD>
                <TD className="tabular font-medium">{kes(d.amount)}</TD>
                <TD>
                  <Badge tone="blue">{d.bank}</Badge>
                </TD>
                <TD className="text-[var(--muted-foreground)]">{d.reference}</TD>
                <TD className="tabular">{kes(d.matchedTillTotal)}</TD>
                <TD>
                  <StatusBadge status={d.status} />
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <LogBankDepositModal open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
