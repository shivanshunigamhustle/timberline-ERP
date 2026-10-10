"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductLineBadge, StatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/field";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { TruckStatus } from "@/lib/types";

const DRIVER_TRUCK_ID = "trk-1";
const STATUSES: TruckStatus[] = ["On route", "At depot", "In service"];

export function MyTruck() {
  const truck = useErpStore((s) => s.trucks.find((t) => t.id === DRIVER_TRUCK_ID))!;
  const updateTruckStatus = useErpStore((s) => s.updateTruckStatus);
  const allDeliveries = useErpStore((s) => s.deliveries);
  const deliveries = allDeliveries.filter((d) => d.truckId === DRIVER_TRUCK_ID);
  const allRunningCosts = useErpStore((s) => s.runningCosts);
  const runningCosts = allRunningCosts.filter((c) => c.truckId === DRIVER_TRUCK_ID);
  const lastService = runningCosts.find((c) => c.type === "Service")?.date ?? "—";
  const deliveriesToday = deliveries.filter((d) => d.date === "2026-10-10").length;

  return (
    <div>
      <PageHeader
        title="My truck"
        description={`${truck.registration} — ${truck.makeModel}`}
        actions={
          <Select className="w-auto" value={truck.status} onChange={(e) => updateTruckStatus(truck.id, e.target.value as TruckStatus)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Deliveries today</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{deliveriesToday}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Deliveries this month</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{deliveries.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">This month&apos;s running cost</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(truck.monthlyRunningCost)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Last service date</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{lastService}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery history</CardTitle>
        </CardHeader>
        <Table>
          <THead>
            <tr>
              <TH>Date</TH>
              <TH>Customer</TH>
              <TH>Product line</TH>
              <TH>Status</TH>
            </tr>
          </THead>
          <tbody>
            {deliveries.map((d) => (
              <TRow key={d.id}>
                <TD className="text-[var(--muted-foreground)]">{d.date}</TD>
                <TD className="font-medium">{d.customerName}</TD>
                <TD>
                  <ProductLineBadge line={d.productLine} />
                </TD>
                <TD>
                  <StatusBadge status={d.status} />
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
