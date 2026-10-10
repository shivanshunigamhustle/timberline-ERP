"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProductLineMonthly } from "@/lib/types";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";

export const LINE_COLORS: Record<string, string> = {
  Timber: "#1f6b4a",
  Gas: "#2563a6",
  "Bio-products": "#b8790c",
};

const LINES = Object.keys(LINE_COLORS);

export function ProfitByLineChart({ data }: { data: ProductLineMonthly[] }) {
  const months = Array.from(new Set(data.map((d) => d.month)));
  const chartData = months.map((month) => {
    const row: Record<string, number | string> = { month };
    data.filter((d) => d.month === month).forEach((d) => {
      row[d.productLine] = d.profit;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} barGap={6} barCategoryGap="28%" margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          {LINES.map((line) => (
            <linearGradient key={line} id={`profit-grad-${line}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE_COLORS[line]} stopOpacity={1} />
              <stop offset="100%" stopColor={LINE_COLORS[line]} stopOpacity={0.55} />
            </linearGradient>
          ))}
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
        <Legend content={<ChartLegend payload={LINES.map((l) => ({ value: l, color: LINE_COLORS[l] }))} />} />
        {LINES.map((line) => (
          <Bar
            key={line}
            dataKey={line}
            name={line}
            fill={`url(#profit-grad-${line})`}
            radius={[5, 5, 0, 0]}
            maxBarSize={20}
            animationDuration={650}
            animationEasing="ease-out"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
