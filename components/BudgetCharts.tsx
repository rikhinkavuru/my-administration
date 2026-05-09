"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { currentBudget, proposedBudget } from "@/lib/data/budget";

function Donut({ title, kicker, data }: { title: string; kicker: string; data: typeof currentBudget }) {
  return (
    <div className="card p-7 md:p-9">
      <div className="eyebrow">{kicker}</div>
      <div className="font-display text-[26px] md:text-[32px] tracking-[-0.025em] mt-3 leading-[1.05]">
        {title}
      </div>
      <div className="h-[300px] mt-7 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={76}
              outerRadius={124}
              paddingAngle={1}
              stroke="var(--bg)"
              strokeWidth={2}
              animationBegin={200}
              animationDuration={1200}
            >
              {data.map((s) => (
                <Cell key={s.category} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 4,
                color: "var(--fg)",
                fontSize: 11,
                fontFamily: "var(--font-kode-mono), monospace",
                padding: "8px 12px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
              formatter={(v, name) => [`${v}%`, String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-7 grid grid-cols-1 gap-2 text-[12px]">
        {data.map((s, i) => (
          <motion.li
            key={s.category}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 py-1.5 border-b border-[var(--hairline)] last:border-0"
          >
            <span
              className="inline-block h-1.5 w-3"
              style={{ background: s.color }}
            />
            <span className="flex-1 text-[var(--fg-60)]">{s.category}</span>
            <span className="tabular-nums text-[var(--fg)] font-mono text-[12px]">{s.value}%</span>
          </motion.li>
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
