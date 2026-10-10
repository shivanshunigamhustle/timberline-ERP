"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { ProductLineBadge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmDeliveryModal, DeliveryIssueModal } from "@/components/modals/delivery-modals";
import { useErpStore } from "@/lib/store";
import type { Delivery } from "@/lib/types";

export function DriverDeliveries() {
  const router = useRouter();
  const trucks = useErpStore((s) => s.trucks);
  const deliveries = useErpStore((s) => s.deliveries);
  const updateDeliveryStatus = useErpStore((s) => s.updateDeliveryStatus);

  const [truckId, setTruckId] = useState(trucks[0].id);
  const [confirmDelivery, setConfirmDelivery] = useState<Delivery | null>(null);
  const [issueDelivery, setIssueDelivery] = useState<Delivery | null>(null);

  const truckDeliveries = deliveries.filter((d) => d.truckId === truckId);

  return (
    <div>
      <PageHeader title="Today's deliveries" description="Truck-by-truck, update status as jobs progress." />

      <div className="mb-5">
        <Tabs
          tabs={trucks.map((t) => t.registration)}
          value={trucks.find((t) => t.id === truckId)?.registration ?? ""}
          onChange={(reg) => setTruckId(trucks.find((t) => t.registration === reg)!.id)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {truckDeliveries.length === 0 ? (
          <p className="text-[13px] text-[var(--muted-foreground)] col-span-full py-8 text-center">No deliveries scheduled for this truck today.</p>
        ) : (
          truckDeliveries.map((d) => (
            <Card key={d.id} className="p-4">
              <button onClick={() => router.push(`/driver/deliveries/${d.id}`)} className="text-left w-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={d.customerName} size={30} />
                    <p className="text-[14.5px] font-semibold">{d.customerName}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
                <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted-foreground)] mb-1">
                  <MapPin size={12} /> {d.area}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <ProductLineBadge line={d.productLine} />
                  <span className="text-[12px] text-[var(--muted-foreground)]">{d.itemsSummary}</span>
                </div>
              </button>
              <div className="flex gap-2 pt-2 border-t border-[var(--border)] mt-1">
                {d.status === "Pending" && (
                  <Button size="sm" variant="primary" onClick={() => updateDeliveryStatus(d.id, "En route")}>
                    Start delivery
                  </Button>
                )}
                {d.status === "En route" && (
                  <>
                    <Button size="sm" variant="primary" onClick={() => setConfirmDelivery(d)}>
                      Mark delivered
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setIssueDelivery(d)}>
                      Mark failed
                    </Button>
                  </>
                )}
                {(d.status === "Delivered" || d.status === "Failed") && (
                  <span className="flex items-center gap-1.5 text-[12px] text-[var(--muted-foreground)]">
                    <Phone size={11} /> {d.phone}
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {confirmDelivery && <ConfirmDeliveryModal delivery={confirmDelivery} open onClose={() => setConfirmDelivery(null)} />}
      {issueDelivery && <DeliveryIssueModal delivery={issueDelivery} open onClose={() => setIssueDelivery(null)} />}
    </div>
  );
}
