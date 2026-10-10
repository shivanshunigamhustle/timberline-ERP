"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyFinancial } from "@/lib/types";
import { ChartTooltip } from "./chart-tooltip";

export function RevenueCostTrendChart({ data, color = "#1f6b4a" }: { data: MonthlyFinancial[]; color?: string }) {
  const gradId = `rev-cost-grad-${color.replace("#", "")}`;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
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
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="cost"
          name="Cost"
          stroke="var(--accent-slate)"
          strokeWidth={1.75}
          strokeDasharray="4 3"
          fill="transparent"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          animationDuration={700}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--surface)" }}
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
