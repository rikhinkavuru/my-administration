"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { currentBudget, proposedBudget } from "@/lib/data/budget";

function Donut({ title, data }: { title: string; data: typeof currentBudget }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">{title}</div>
      <div className="h-[360px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              stroke="var(--bg-elev)"
            >
              {data.map((s) => (
                <Cell key={s.category} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--bg-elev-2)",
                border: "1px solid var(--border-strong)",
                borderRadius: 8,
                color: "var(--fg)",
              }}
              formatter={(v, name) => [`${v}%`, String(name)]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--fg-muted)" }}
              iconType="square"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function BudgetCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Donut title="Current Federal Budget (FY 2025, ~$6.75T)" data={currentBudget} />
      <Donut title="Sackett / Kavuru Proposed Budget" data={proposedBudget} />
    </div>
  );
}
