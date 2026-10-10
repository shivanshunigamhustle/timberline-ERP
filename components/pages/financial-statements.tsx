"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/field";
import { LINE_COLORS } from "@/components/charts/profit-by-line-chart";
import { PRODUCT_LINE_MONTHLY, kes } from "@/lib/mock-data";
import { toast } from "@/lib/toast-store";

const STATEMENTS = ["Profit & Loss", "Balance Sheet", "Cash Flow Statement"] as const;
const PERIODS = ["This month", "Last month", "This quarter", "This year"];

function Row({ label, value, bold, indent }: { label: string; value?: string; bold?: boolean; indent?: boolean }) {
  return (
    <div className={`flex justify-between py-2.5 ${bold ? "font-semibold border-t border-[var(--border)] mt-1 pt-3" : ""} ${indent ? "pl-4" : ""}`}>
      <span className={bold ? "" : "text-[var(--muted-foreground)]"}>{label}</span>
      {value && <span className="tabular font-medium">{value}</span>}
    </div>
  );
}

function Bar({ label, value, amount, color }: { label: string; value: number; amount: string; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px] mb-1.5">
        <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          {label}
        </span>
        <span className="font-medium tabular">{amount}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--surface-muted)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function RatioTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] bg-[var(--surface-muted)] px-4 py-3">
      <p className="text-[11.5px] text-[var(--muted-foreground)]">{label}</p>
      <p className="text-[19px] font-semibold tabular mt-1">{value}</p>
    </div>
  );
}

export function FinancialStatements({ variant }: { variant: "owner" | "accountant" }) {
  const [statement, setStatement] = useState<(typeof STATEMENTS)[number]>("Profit & Loss");
  const [period, setPeriod] = useState(PERIODS[0]);

  const octRows = PRODUCT_LINE_MONTHLY.filter((d) => d.month === "Oct");
  const totalRevenue = octRows.reduce((s, r) => s + r.revenue, 0);
  const totalCost = octRows.reduce((s, r) => s + r.cost, 0);
  const grossProfit = totalRevenue - totalCost;
  const opex = Math.round(totalRevenue * 0.09);
  const netProfit = grossProfit - opex;
  const grossMargin = Math.round((grossProfit / totalRevenue) * 100);
  const netMargin = Math.round((netProfit / totalRevenue) * 100);

  const totalAssets = 11237900;
  const totalLiabilities = 1053500;
  const equity = 10184400;

  const cashFlowRows = [
    { label: "Operating", amount: 383600 },
    { label: "Investing", amount: -42000 },
    { label: "Financing", amount: -120000 },
  ];
  const netCashMovement = cashFlowRows.reduce((s, r) => s + r.amount, 0);
  const maxCashFlow = Math.max(...cashFlowRows.map((r) => Math.abs(r.amount)));

  return (
    <div>
      <PageHeader
        title="Financial statements"
        description="Standard-format statements, broken out by product line."
        actions={
          variant === "owner" ? (
            <Button variant="primary" onClick={() => toast("Statement sent to Accountant portal", "success")}>
              Export for accountant
            </Button>
          ) : (
            <>
              <Select className="w-auto" value={period} onChange={(e) => setPeriod(e.target.value)}>
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
              <Button variant="secondary" onClick={() => toast("Download ready")}>
                <Download size={14} /> PDF
              </Button>
              <Button variant="secondary" onClick={() => toast("Download ready")}>
                <Download size={14} /> Excel
              </Button>
            </>
          )
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
        <Card>
          <div className="px-5 pt-4">
            <Tabs tabs={[...STATEMENTS]} value={statement} onChange={setStatement} />
          </div>
          <CardBody className="max-w-xl">
            {statement === "Profit & Loss" && (
              <div className="text-[13.5px]">
                <Row label="Revenue" value={kes(totalRevenue)} bold />
                {octRows.map((r) => (
                  <Row key={r.productLine} label={r.productLine} value={kes(r.revenue)} indent />
                ))}
                <Row label="Cost of goods sold" value={kes(totalCost)} bold />
                <Row label="Gross profit" value={kes(grossProfit)} bold />
                <Row label="Operating expenses" value={kes(opex)} bold />
                <Row label="Net profit" value={kes(netProfit)} bold />
              </div>
            )}
            {statement === "Balance Sheet" && (
              <div className="text-[13.5px]">
                <Row label="Assets" bold />
                <Row label="Cash and bank" value="KES 1,842,300" indent />
                <Row label="Inventory" value="KES 3,120,600" indent />
                <Row label="Fixed assets (fleet, equipment)" value="KES 6,275,000" indent />
                <Row label="Total assets" value={kes(totalAssets)} bold />
                <Row label="Liabilities" bold />
                <Row label="Supplier payables" value="KES 842,100" indent />
                <Row label="VAT payable" value="KES 211,400" indent />
                <Row label="Total liabilities" value={kes(totalLiabilities)} bold />
                <Row label="Equity" value={kes(equity)} bold />
              </div>
            )}
            {statement === "Cash Flow Statement" && (
              <div className="text-[13.5px]">
                <Row label="Operating activities" bold />
                <Row label="Cash from sales" value="KES 1,196,000" indent />
                <Row label="Cash to suppliers and expenses" value="KES (812,400)" indent />
                <Row label="Net operating cash flow" value="KES 383,600" bold />
                <Row label="Investing activities" bold />
                <Row label="Equipment purchases" value="KES (42,000)" indent />
                <Row label="Financing activities" bold />
                <Row label="Owner drawings" value="KES (120,000)" indent />
                <Row label="Net cash movement" value={kes(netCashMovement)} bold />
              </div>
            )}
          </CardBody>
        </Card>

        <div className="flex flex-col gap-5">
          {statement === "Profit & Loss" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by product line</CardTitle>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                  {octRows.map((r) => (
                    <Bar
                      key={r.productLine}
                      label={r.productLine}
                      amount={kes(r.revenue)}
                      value={Math.round((r.revenue / totalRevenue) * 100)}
                      color={LINE_COLORS[r.productLine]}
                    />
                  ))}
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Margins</CardTitle>
                </CardHeader>
                <CardBody className="grid grid-cols-2 gap-3">
                  <RatioTile label="Gross margin" value={`${grossMargin}%`} />
                  <RatioTile label="Net margin" value={`${netMargin}%`} />
                  <RatioTile label="Opex / revenue" value={`${Math.round((opex / totalRevenue) * 100)}%`} />
                  <RatioTile label="COGS / revenue" value={`${Math.round((totalCost / totalRevenue) * 100)}%`} />
                </CardBody>
              </Card>
            </>
          )}

          {statement === "Balance Sheet" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Asset composition</CardTitle>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                  <Bar label="Cash and bank" amount="KES 1,842,300" value={16} color="#2563a6" />
                  <Bar label="Inventory" amount="KES 3,120,600" value={28} color="#b8790c" />
                  <Bar label="Fixed assets" amount="KES 6,275,000" value={56} color="#1f6b4a" />
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Capital structure</CardTitle>
                </CardHeader>
                <CardBody className="grid grid-cols-1 gap-3">
                  <RatioTile label="Debt-to-equity" value={(totalLiabilities / equity).toFixed(2)} />
                  <RatioTile label="Equity / total assets" value={`${Math.round((equity / totalAssets) * 100)}%`} />
                </CardBody>
              </Card>
            </>
          )}

          {statement === "Cash Flow Statement" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Movement by activity</CardTitle>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                  {cashFlowRows.map((r) => (
                    <Bar
                      key={r.label}
                      label={r.label}
                      amount={kes(r.amount)}
                      value={Math.round((Math.abs(r.amount) / maxCashFlow) * 100)}
                      color={r.amount >= 0 ? "#1f6b4a" : "#c23b3b"}
                    />
                  ))}
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Net position</CardTitle>
                </CardHeader>
                <CardBody>
                  <RatioTile label="Net cash movement (this period)" value={kes(netCashMovement)} />
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
