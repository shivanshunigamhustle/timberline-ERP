"use client";

import { useState } from "react";
import { Download, FileStack } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { toast } from "@/lib/toast-store";

const PACKAGES = [
  { id: "p1", title: "Monthly P&L pack", description: "Profit & loss statement with product-line breakdown." },
  { id: "p2", title: "VAT return support pack", description: "Sales, purchases and VAT schedule for KRA filing." },
  { id: "p3", title: "Full ledger export", description: "Every transaction, double-entry style, for the period." },
  { id: "p4", title: "Fixed asset register", description: "Fleet and equipment with purchase values and condition." },
];

function ExportCard({ title, description }: { title: string; description: string }) {
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");

  return (
    <Card className="p-5 flex flex-col">
      <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--brand-light)] text-[var(--brand-dark)] mb-3">
        <FileStack size={16} />
      </div>
      <p className="text-[14px] font-semibold">{title}</p>
      <p className="text-[12.5px] text-[var(--muted-foreground)] mt-1 mb-4 leading-5">{description}</p>
      <div className="mt-auto flex items-center gap-2">
        <Select className="w-auto flex-1" defaultValue="This month">
          <option>This month</option>
          <option>Last month</option>
          <option>This quarter</option>
          <option>This year</option>
        </Select>
        {state === "ready" ? (
          <Button variant="primary" onClick={() => toast("Download ready")}>
            <Download size={14} /> Download
          </Button>
        ) : (
          <Button
            variant="secondary"
            disabled={state === "loading"}
            onClick={() => {
              setState("loading");
              setTimeout(() => setState("ready"), 1100);
            }}
          >
            {state === "loading" ? "Preparing export..." : "Generate"}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function ExportCenter() {
  return (
    <div>
      <PageHeader title="Export center" description="Export-ready packages for KRA filing and record-keeping." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PACKAGES.map((p) => (
          <ExportCard key={p.id} title={p.title} description={p.description} />
        ))}
      </div>
    </div>
  );
}
