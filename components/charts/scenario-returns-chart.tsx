"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartDataPoint = { period: string; avg: number; sp500?: number };

export function ScenarioReturnsChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="period" className="text-xs" />
          <YAxis className="text-xs" tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Avg Return"]} />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="hsl(var(--color-primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
