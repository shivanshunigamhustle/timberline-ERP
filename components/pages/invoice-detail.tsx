"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { SendInvoiceModal } from "@/components/modals/send-invoice-modal";
import { RecordPaymentModal } from "@/components/modals/record-payment-modal";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import { toast } from "@/lib/toast-store";
import type { Invoice } from "@/lib/types";

export function InvoiceDetail({ invoice, basePath, readOnly = false }: { invoice: Invoice; basePath: string; readOnly?: boolean }) {
  const router = useRouter();
  const [sendOpen, setSendOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const subtotal = invoice.amount;
  const vat = invoice.vatAmount;
  const total = subtotal + vat;

  return (
    <div>
      <button
        onClick={() => router.push(basePath)}
        className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-3 transition-colors"
      >
        <ArrowLeft size={13} /> Back to invoices
      </button>
      <PageHeader
        title={invoice.invoiceNumber}
        description={
          <span className="inline-flex items-center gap-2">
            <StatusBadge status={invoice.status} /> &middot; {invoice.customerName}
          </span>
        }
        actions={
          !readOnly && (
            <>
              <Button variant="secondary" onClick={() => toast("Invoice PDF ready")}>
                <Download size={14} /> Download PDF
              </Button>
              {invoice.status === "Draft" && (
                <Button variant="primary" onClick={() => setSendOpen(true)}>
                  <Send size={14} /> Send to customer
                </Button>
              )}
              {(invoice.status === "Sent" || invoice.status === "Overdue") && (
                <Button variant="primary" onClick={() => setPayOpen(true)}>
                  Record payment
                </Button>
              )}
            </>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card>
          <CardBody>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[15px] font-semibold">Timberline Traders Ltd</p>
                <p className="text-[12.5px] text-[var(--muted-foreground)] mt-1 leading-5">
                  Mombasa Road, Industrial Area
                  <br />
                  Nairobi, Kenya
                  <br />
                  KRA PIN: P051998271M
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12.5px] text-[var(--muted-foreground)]">eTIMS invoice #</p>
                <p className="text-[13px] font-medium">ETR-{invoice.invoiceNumber.replace("TL-", "")}</p>
                <p className="text-[12.5px] text-[var(--muted-foreground)] mt-2">Issue date</p>
                <p className="text-[13px] font-medium">{invoice.issueDate}</p>
                <p className="text-[12.5px] text-[var(--muted-foreground)] mt-2">Due date</p>
                <p className="text-[13px] font-medium">{invoice.dueDate}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[12px] text-[var(--muted-foreground)] mb-1">Bill to</p>
              <p className="text-[13.5px] font-medium">{invoice.customerName}</p>
              {invoice.customerPhone && <p className="text-[12.5px] text-[var(--muted-foreground)]">{invoice.customerPhone}</p>}
              {invoice.customerKraPin && <p className="text-[12.5px] text-[var(--muted-foreground)]">KRA PIN: {invoice.customerKraPin}</p>}
            </div>

            <table className="w-full text-[13px] mb-6">
              <thead>
                <tr className="border-b border-[var(--border)] text-[12px] text-[var(--muted-foreground)] uppercase tracking-wide">
                  <th className="text-left py-2 font-medium">Description</th>
                  <th className="text-right py-2 font-medium">Qty</th>
                  <th className="text-right py-2 font-medium">Unit price</th>
                  <th className="text-right py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((li) => (
                  <tr key={li.id} className="border-b border-[var(--border)]">
                    <td className="py-2.5">{li.description}</td>
                    <td className="py-2.5 text-right tabular">{li.qty}</td>
                    <td className="py-2.5 text-right tabular">{kes(li.unitPrice)}</td>
                    <td className="py-2.5 text-right tabular">{kes(li.qty * li.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-56 space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--muted-foreground)]">Subtotal</span>
                  <span className="tabular">{kes(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--muted-foreground)]">VAT (16%)</span>
                  <span className="tabular">{kes(vat)}</span>
                </div>
                <div className="flex justify-between text-[14.5px] font-semibold pt-1.5 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span className="tabular">{kes(total)}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-[var(--border)]">
              {[...invoice.activity].reverse().map((a) => (
                <li key={a.id} className="px-5 py-3.5">
                  <p className="text-[13px] font-medium">{a.label}</p>
                  <p className="text-[11.5px] text-[var(--muted-foreground)] mt-1">
                    {a.actor} &middot; {a.timestamp}
                  </p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <SendInvoiceModal invoice={invoice} open={sendOpen} onClose={() => setSendOpen(false)} />
      <RecordPaymentModal invoice={invoice} open={payOpen} onClose={() => setPayOpen(false)} />
    </div>
  );
}
