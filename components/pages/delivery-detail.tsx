"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmDeliveryModal, DeliveryIssueModal } from "@/components/modals/delivery-modals";
import { useErpStore } from "@/lib/store";
import type { Delivery } from "@/lib/types";

export function DeliveryDetail({ delivery }: { delivery: Delivery }) {
  const router = useRouter();
  const updateDeliveryStatus = useErpStore((s) => s.updateDeliveryStatus);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => router.push("/driver/deliveries")}
        className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-3 transition-colors"
      >
        <ArrowLeft size={13} /> Back to today&apos;s deliveries
      </button>
      <PageHeader
        title={delivery.customerName}
        description={<StatusBadge status={delivery.status} />}
        actions={
          <>
            {delivery.status === "Pending" && (
              <Button variant="primary" onClick={() => updateDeliveryStatus(delivery.id, "En route")}>
                Start delivery
              </Button>
            )}
            {delivery.status === "En route" && (
              <>
                <Button variant="secondary" onClick={() => setIssueOpen(true)}>
                  Mark failed
                </Button>
                <Button variant="primary" onClick={() => setConfirmOpen(true)}>
                  Mark delivered
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Order details</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-[13px]">
              <thead className="bg-[var(--surface-muted)] text-[11.5px] text-[var(--muted-foreground)] uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-2.5 font-medium">Item</th>
                  <th className="text-right px-5 py-2.5 font-medium">Quantity</th>
                  <th className="text-right px-5 py-2.5 font-medium">Unit</th>
                </tr>
              </thead>
              <tbody>
                {delivery.items.map((it, idx) => (
                  <tr key={idx} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-5 py-3">{it.name}</td>
                    <td className="px-5 py-3 text-right tabular">{it.qty}</td>
                    <td className="px-5 py-3 text-right text-[var(--muted-foreground)]">{it.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
          <div className="relative h-40 bg-[var(--surface-muted)] border-t border-[var(--border)] flex items-center justify-center text-[12.5px] text-[var(--muted-foreground)]">
            Map preview unavailable in this demo
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3 text-[13.5px]">
            <div className="flex items-center gap-3 pb-1">
              <Avatar name={delivery.customerName} size={40} />
              <div>
                <p className="text-[11.5px] text-[var(--muted-foreground)]">Name</p>
                <p className="font-medium">{delivery.customerName}</p>
              </div>
            </div>
            <div>
              <p className="text-[11.5px] text-[var(--muted-foreground)]">Phone</p>
              <p className="font-medium">{delivery.phone}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[var(--muted-foreground)]">Address</p>
              <p className="font-medium">{delivery.area}</p>
            </div>
            {delivery.receivedBy && (
              <div>
                <p className="text-[11.5px] text-[var(--muted-foreground)]">Received by</p>
                <p className="font-medium">{delivery.receivedBy}</p>
              </div>
            )}
            {delivery.failReason && (
              <div>
                <p className="text-[11.5px] text-[var(--muted-foreground)]">Issue reason</p>
                <p className="font-medium text-[var(--accent-red)]">{delivery.failReason}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <ConfirmDeliveryModal delivery={delivery} open={confirmOpen} onClose={() => setConfirmOpen(false)} />
      <DeliveryIssueModal delivery={delivery} open={issueOpen} onClose={() => setIssueOpen(false)} />
    </div>
  );
}
