"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { LogRunningCostModal } from "@/components/modals/log-running-cost-modal";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";

const DRIVER_TRUCK_ID = "trk-1";

export function DriverTruckLog() {
  const truck = useErpStore((s) => s.trucks.find((t) => t.id === DRIVER_TRUCK_ID))!;
  const allCosts = useErpStore((s) => s.runningCosts);
  const costs = allCosts.filter((c) => c.truckId === DRIVER_TRUCK_ID);
  const [logOpen, setLogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title={`Truck log — ${truck.registration}`}
        description="Fuel, service, repair and other running costs."
        actions={
          <Button variant="primary" onClick={() => setLogOpen(true)}>
            <Plus size={14} /> Log a cost
          </Button>
        }
      />
      <Card>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Type</TH>
              <TH>Amount</TH>
              <TH>Note</TH>
            </tr>
          </THead>
          <tbody>
            {costs.map((c) => (
              <TRow key={c.id}>
                <TD className="text-[var(--muted-foreground)]">{c.date}</TD>
                <TD>
                  <StatusBadge status={c.type} />
                </TD>
                <TD className="tabular font-medium">{kes(c.amount)}</TD>
                <TD className="text-[var(--muted-foreground)]">{c.note}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
      <LogRunningCostModal truckId={truck.id} open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
