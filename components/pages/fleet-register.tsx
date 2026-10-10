"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { TruckImage } from "@/components/ui/product-image";
import { AddTruckModal } from "@/components/modals/add-truck-modal";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";

export function FleetRegister() {
  const router = useRouter();
  const trucks = useErpStore((s) => s.trucks);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Fleet register"
        description="The 3-truck fleet, at a glance."
        actions={
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            <Plus size={14} /> Add truck
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trucks.map((truck, index) => (
          <Card
            key={truck.id}
            className="overflow-hidden cursor-pointer transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
          >
            <button onClick={() => router.push(`/owner/fleet/${truck.id}`)} className="text-left w-full">
              <div className="relative">
                <TruckImage index={index} />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={truck.status} />
                </div>
              </div>
              <div className="p-4">
                <p className="text-[15.5px] font-semibold">{truck.registration}</p>
                <p className="text-[13px] text-[var(--muted-foreground)] mt-0.5">{truck.makeModel}</p>
                <div className="flex items-center gap-2 mt-3 mb-3">
                  <Avatar name={truck.assignedDriver} size={26} />
                  <span className="text-[13px] text-[var(--muted-foreground)]">{truck.assignedDriver}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <span className="text-[12.5px] text-[var(--muted-foreground)]">Running cost this month</span>
                  <span className="text-[14px] font-semibold tabular">{kes(truck.monthlyRunningCost)}</span>
                </div>
              </div>
            </button>
          </Card>
        ))}
      </div>

      <AddTruckModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
