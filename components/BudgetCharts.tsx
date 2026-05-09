"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { currentBudget, proposedBudget } from "@/lib/data/budget";
import TiltCard from "./TiltCard";

function Donut({ title, kicker, data }: { title: string; kicker: string; data: typeof currentBudget }) {
  return (
    <TiltCard intensity={4} className="glass p-7 md:p-9">
      <div className="smallcaps">{kicker}</div>
      <div className="font-display text-2xl md:text-3xl tracking-tight mt-2">{title}</div>
      <div className="h-[320px] mt-6 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={78}
              outerRadius={128}
              paddingAngle={1.5}
              stroke="transparent"
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
                background: "rgba(8,9,15,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                color: "var(--ink)",
                fontSize: 12,
                padding: "8px 12px",
                backdropFilter: "blur(10px)",
              }}
              formatter={(v, name) => [`${v}%`, String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-2 text-[13px]">
        {data.map((s, i) => (
          <motion.li
            key={s.category}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 12px ${s.color}` }} />
            <span className="flex-1 text-[var(--ink-muted)]">{s.category}</span>
            <span className="tabular-nums text-[var(--ink)]">{s.value}%</span>
          </motion.li>
        ))}
      </ul>
    </TiltCard>
  );
}

export default function BudgetCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Donut title="Current Federal Budget" kicker="FY 2025 · ~$6.75T" data={currentBudget} />
      <Donut title="Sackett / Kavuru Proposed" kicker="With debt-reduction set-aside" data={proposedBudget} />
    </div>
  );
}
