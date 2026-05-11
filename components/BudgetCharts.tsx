"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import { currentBudget, proposedBudget } from "@/lib/data/budget";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function Donut({
  title,
  kicker,
  data,
  totalLabel,
}: {
  title: string;
  kicker: string;
  data: typeof currentBudget;
  totalLabel: string;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="card p-7 md:p-9 relative group">
      <div className="flex items-baseline justify-between mb-2">
        <div className="eyebrow">{kicker}</div>
        <span className="font-mono text-[10px] tabular-nums tracking-[0.06em] text-[var(--fg-40)]">
          {total}%
        </span>
      </div>
      <div className="font-display text-[26px] md:text-[34px] tracking-[-0.03em] mt-3 leading-[1.02]">
        {title}
      </div>

      <div className="h-[300px] mt-7 relative">
        {/* center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoverIdx === null ? (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-40)]">
                Total
              </div>
              <div className="font-display text-[36px] md:text-[44px] tabular-nums leading-none mt-1">
                {totalLabel}
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent-red)]">
                {data[hoverIdx].category}
              </div>
              <div className="font-display text-[36px] md:text-[44px] tabular-nums leading-none mt-1">
                {data[hoverIdx].value}
                <span className="text-[var(--fg-40)] text-[20px]">%</span>
              </div>
            </>
          )}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={88}
              outerRadius={128}
              paddingAngle={1.2}
              stroke="var(--bg)"
              strokeWidth={2}
              animationBegin={200}
              animationDuration={1200}
              onMouseEnter={(_, idx) => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              {data.map((s, idx) => (
                <Cell
                  key={s.category}
                  fill={s.color}
                  opacity={hoverIdx === null || hoverIdx === idx ? 1 : 0.32}
                  style={{ transition: "opacity 220ms ease" }}
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "var(--bg)",
                border: "1px solid var(--hairline-strong)",
                borderRadius: 0,
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

      <ul role="list" className="mt-7 grid grid-cols-1 gap-0 text-[12px]">
        {data.map((s, i) => {
          const active = hoverIdx === i;
          return (
            <motion.li
              key={s.category}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.4 + i * 0.04, ease: EASE }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className={`flex items-center gap-3 py-2 border-b border-[var(--hairline)] last:border-0 transition-colors cursor-default ${
                active ? "bg-[var(--bg-elev-2)]" : ""
              }`}
            >
              <span
                className="inline-block h-[7px] w-[7px]"
                style={{ background: s.color, outline: active ? `1px solid ${s.color}` : "none", outlineOffset: 2 }}
              />
              <span className="flex-1 text-[var(--fg-60)] truncate">{s.category}</span>
              <span className="tabular-nums text-[var(--fg)] font-mono text-[12px]">{s.value}%</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default function BudgetCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Donut
        title="Current Federal Budget"
        kicker="FY 2025 — Baseline"
        totalLabel="$6.75T"
        data={currentBudget}
      />
      <Donut
        title="Sackett / Kavuru Proposed"
        kicker="With debt-reduction set-aside"
        totalLabel="$5.92T"
        data={proposedBudget}
      />
    </div>
  );
}
