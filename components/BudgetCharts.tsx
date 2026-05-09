"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { currentBudget, proposedBudget } from "@/lib/data/budget";

function Donut({ title, kicker, data }: { title: string; kicker: string; data: typeof currentBudget }) {
  return (
    <div className="surface p-7 md:p-9">
      <div className="smallcaps">{kicker}</div>
      <div className="font-display text-xl md:text-2xl tracking-tight mt-2">{title}</div>
      <div className="h-[300px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={72}
              outerRadius={118}
              paddingAngle={1.5}
              stroke="var(--bg-elev)"
              strokeWidth={2}
            >
              {data.map((s) => (
                <Cell key={s.category} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "var(--bg-elev-2)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: 8,
                color: "var(--ink)",
                fontSize: 12,
                padding: "8px 12px",
              }}
              formatter={(v, name) => [`${v}%`, String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-2 text-[13px]">
        {data.map((s) => (
          <li key={s.category} className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span className="flex-1 text-[var(--ink-muted)]">{s.category}</span>
            <span className="tabular-nums text-[var(--ink)]">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BudgetCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Donut title="Current Federal Budget" kicker="FY 2025 — ~$6.75T" data={currentBudget} />
      <Donut title="Sackett / Kavuru Proposed" kicker="With debt-reduction set-aside" data={proposedBudget} />
    </div>
  );
}
