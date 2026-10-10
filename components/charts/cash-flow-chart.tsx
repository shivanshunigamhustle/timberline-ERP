"use client";

import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";

export function CashFlowChart({ data }: { data: { month: string; inflow: number; outflow: number }[] }) {
  const chartData = data.map((d) => ({ ...d, net: d.inflow - d.outflow }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={chartData} barGap={6} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="inflow-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f6b4a" stopOpacity={1} />
            <stop offset="100%" stopColor="#1f6b4a" stopOpacity={0.55} />
          </linearGradient>
          <linearGradient id="outflow-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c23b3b" stopOpacity={1} />
            <stop offset="100%" stopColor="#c23b3b" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12.5, fill: "var(--muted-foreground)" }} dy={6} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12.5, fill: "var(--muted-foreground)" }}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          width={44}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--surface-muted)", radius: 6 }} />
        <Legend
          content={
            <ChartLegend
              payload={[
                { value: "Inflow", color: "#1f6b4a" },
                { value: "Outflow", color: "#c23b3b" },
                { value: "Net", color: "#2563a6" },
              ]}
            />
          }
        />
        <Bar dataKey="inflow" name="Inflow" fill="url(#inflow-grad)" radius={[5, 5, 0, 0]} maxBarSize={22} animationDuration={650} />
        <Bar dataKey="outflow" name="Outflow" fill="url(#outflow-grad)" radius={[5, 5, 0, 0]} maxBarSize={22} animationDuration={650} />
        <Line
          type="monotone"
          dataKey="net"
          name="Net"
          stroke="#2563a6"
          strokeWidth={2.25}
          dot={{ r: 3, strokeWidth: 0, fill: "#2563a6" }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--surface)" }}
          animationDuration={700}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
