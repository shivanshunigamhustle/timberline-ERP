"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ProductLineBadge } from "@/components/ui/badge";
import { OpenTillModal, CloseTillModal } from "@/components/modals/till-modals";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";

const TILL_ID = "till-1";

export function CashierTill() {
  const router = useRouter();
  const till = useErpStore((s) => s.tills.find((t) => t.id === TILL_ID))!;
  const allTransactions = useErpStore((s) => s.tillTransactions);
  const transactions = allTransactions.filter((t) => t.tillId === TILL_ID);
  const [openModal, setOpenModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  const cashTotal = transactions.filter((t) => t.paymentMethod === "Cash").reduce((s, t) => s + t.amount, 0);
  const mpesaTotal = transactions.filter((t) => t.paymentMethod === "M-Pesa").reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <PageHeader title="Till" description="Your till for the day." />

      <Card className="mb-5 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[16px] font-semibold">{till.name}</p>
              <StatusBadge status={till.status} />
            </div>
            <p className="text-[12.5px] text-[var(--muted-foreground)]">Opening float: {kes(till.openingFloat)}</p>
          </div>
          {till.status === "Open" ? (
            <Button variant="secondary" onClick={() => setCloseModal(true)}>
              Close till
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setOpenModal(true)}>
              Open till
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Cash collected (today)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(cashTotal)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">M-Pesa collected (today)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(mpesaTotal)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Transactions (today)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{transactions.length}</p>
        </Card>
      </div>

      <Button
        variant="primary"
        className="w-full h-14 text-[15px] mb-5"
        disabled={till.status !== "Open"}
        onClick={() => router.push("/cashier/new-sale")}
      >
        <ShoppingCart size={18} /> New Sale
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s transactions</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          {transactions.length === 0 ? (
            <p className="px-5 py-6 text-[13px] text-[var(--muted-foreground)]">No sales recorded yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {transactions.map((t) => (
                <li key={t.id} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-14 text-[12px] text-[var(--muted-foreground)]">{t.time}</span>
                  <span className="flex-1 text-[13px] font-medium">{t.customerName}</span>
                  <ProductLineBadge line={t.productLine} />
                  <span className="w-28 text-right tabular font-medium text-[13px]">{kes(t.amount)}</span>
                  <span className="w-24 text-right text-[12px] text-[var(--muted-foreground)]">{t.paymentMethod}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <OpenTillModal till={till} open={openModal} onClose={() => setOpenModal(false)} />
      <CloseTillModal till={till} cashTotal={cashTotal} mpesaTotal={mpesaTotal} open={closeModal} onClose={() => setCloseModal(false)} />
    </div>
  );
}
