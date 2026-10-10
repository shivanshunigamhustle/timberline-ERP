"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/toast-store";

export function OwnerSettings() {
  const [etimsStatus, setEtimsStatus] = useState<"Connected" | "Reconnecting...">("Connected");

  return (
    <div>
      <PageHeader title="Settings" description="Business profile, invoicing defaults and integrations." />

      <div className="max-w-2xl space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Business profile</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Business name">
              <Input defaultValue="Timberline Traders Ltd" />
            </Field>
            <Field label="KRA PIN">
              <Input defaultValue="P051998271M" />
            </Field>
            <Field label="Address">
              <Input defaultValue="Mombasa Road, Industrial Area, Nairobi" />
            </Field>
            <Field label="Phone">
              <Input defaultValue="0700 112 334" />
            </Field>
            <div className="sm:col-span-2">
              <Button variant="primary" onClick={() => toast("Settings saved", "success")}>
                Save
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoicing</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Default VAT rate">
              <Input defaultValue="16%" />
            </Field>
            <Field label="Invoice number prefix">
              <Input defaultValue="TL-" />
            </Field>
            <div className="sm:col-span-2 flex items-center justify-between rounded-[8px] bg-[var(--surface-muted)] px-4 py-3 mb-3.5">
              <div>
                <p className="text-[13px] font-medium">KRA eTIMS device status</p>
                <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">Electronic Tax Invoice Management System</p>
              </div>
              <Badge tone={etimsStatus === "Connected" ? "green" : "amber"}>{etimsStatus}</Badge>
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setEtimsStatus("Reconnecting...");
                  setTimeout(() => {
                    setEtimsStatus("Connected");
                    toast("eTIMS device reconnected", "success");
                  }, 1200);
                }}
              >
                Reconnect eTIMS device
              </Button>
              <Button variant="primary" onClick={() => toast("Settings saved", "success")}>
                Save
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
