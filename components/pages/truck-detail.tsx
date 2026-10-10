"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, ProductLineBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { TruckImage } from "@/components/ui/product-image";
import { LogRunningCostModal } from "@/components/modals/log-running-cost-modal";
import { kes } from "@/lib/mock-data";
import { useErpStore } from "@/lib/store";
import type { Truck, TruckStatus } from "@/lib/types";

const STATUSES: TruckStatus[] = ["On route", "At depot", "In service"];

export function TruckDetail({ truck, basePath }: { truck: Truck; basePath: string }) {
  const router = useRouter();
  const updateTruckStatus = useErpStore((s) => s.updateTruckStatus);
  const allRunningCosts = useErpStore((s) => s.runningCosts);
  const runningCosts = allRunningCosts.filter((c) => c.truckId === truck.id);
  const allDeliveries = useErpStore((s) => s.deliveries);
  const deliveries = allDeliveries.filter((d) => d.truckId === truck.id);
  const [tab, setTab] = useState<"Delivery history" | "Running costs">("Delivery history");
  const [logOpen, setLogOpen] = useState(false);

  const fuelThisMonth = runningCosts.filter((c) => c.type === "Fuel").reduce((s, c) => s + c.amount, 0);
  const lastService = runningCosts.find((c) => c.type === "Service")?.date ?? "—";

  return (
    <div>
      <button
        onClick={() => router.push(basePath)}
        className="flex items-center gap-1.5 text-[12.5px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-3 transition-colors"
      >
        <ArrowLeft size={13} /> Back to fleet register
      </button>
      <PageHeader
        title={truck.registration}
        description={
          <span className="inline-flex items-center gap-2">
            <Avatar name={truck.assignedDriver} size={20} />
            {truck.makeModel} &middot; {truck.assignedDriver}
          </span>
        }
        actions={
          <>
            <Select
              className="w-auto"
              value={truck.status}
              onChange={(e) => updateTruckStatus(truck.id, e.target.value as TruckStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Button variant="primary" onClick={() => setLogOpen(true)}>
              <Plus size={14} /> Log a cost
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden mb-5">
        <TruckImage index={Number(truck.id.replace("trk-", "")) - 1} className="h-40" />
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">This month&apos;s running cost</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(truck.monthlyRunningCost)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Deliveries this month</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{deliveries.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Fuel cost (this month)</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{kes(fuelThisMonth)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12.5px] font-medium text-[var(--muted-foreground)]">Last service date</p>
          <p className="text-[19px] font-semibold tabular mt-1.5">{lastService}</p>
        </Card>
      </div>

      <Card>
        <div className="px-5 pt-4">
          <Tabs tabs={["Delivery history", "Running costs"]} value={tab} onChange={setTab} />
        </div>
        {tab === "Delivery history" ? (
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
        ) : (
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
              {runningCosts.map((c) => (
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
        )}
      </Card>

      <LogRunningCostModal truckId={truck.id} open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
