"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProductLineMonthly } from "@/lib/types";
import { ChartTooltip } from "./chart-tooltip";
import { ChartLegend } from "./chart-legend";
import { LINE_COLORS } from "./profit-by-line-chart";
import { kes } from "@/lib/mock-data";

const LINES = Object.keys(LINE_COLORS);

function TotalLabel(props: { x?: number; y?: number; width?: number; value?: number }) {
  const { x = 0, y = 0, width = 0, value } = props;
  if (value === undefined) return null;
  return (
    <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="var(--foreground)">
      {kes(value).replace("KES ", "")}
    </text>
  );
}

export function StackedRevenueChart({ data }: { data: ProductLineMonthly[] }) {
  const months = Array.from(new Set(data.map((d) => d.month)));
  const chartData = months.map((month) => {
    const row: Record<string, number | string> = { month };
    let total = 0;
    data.filter((d) => d.month === month).forEach((d) => {
      row[d.productLine] = d.revenue;
      total += d.revenue;
    });
    row.total = total;
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 24, right: 8, left: -12, bottom: 0 }}>
        <defs>
          {LINES.map((line) => (
            <linearGradient key={line} id={`stack-grad-${line}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE_COLORS[line]} stopOpacity={1} />
              <stop offset="100%" stopColor={LINE_COLORS[line]} stopOpacity={0.6} />
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
        <Tooltip content={<ChartTooltip showTotal />} cursor={{ fill: "var(--surface-muted)", radius: 6 }} />
        <Legend content={<ChartLegend payload={LINES.map((l) => ({ value: l, color: LINE_COLORS[l] }))} />} />
        {LINES.map((line, i) => (
          <Bar
            key={line}
            dataKey={line}
            name={line}
            stackId="rev"
            fill={`url(#stack-grad-${line})`}
            radius={i === LINES.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
            maxBarSize={38}
            animationDuration={650}
          >
            {i === LINES.length - 1 && <LabelList dataKey="total" content={<TotalLabel />} />}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
