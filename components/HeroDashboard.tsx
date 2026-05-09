"use client";
import { motion } from "framer-motion";
import Counter from "./Counter";
import { states, evByClass } from "@/lib/data/states";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const SAFE_R = evByClass["safe-r"];
const LEAN_R = evByClass["lean-r"];
const TARGET = evByClass.battleground;
const CONCEDE = evByClass["safe-d"];
const LOCKED = SAFE_R + LEAN_R;
const THRESHOLD = 270;
const BAR_PCT = Math.min((LOCKED / THRESHOLD) * 100, 100);

const coalitions = [
  { label: "Safe", value: SAFE_R },
  { label: "Lean", value: LEAN_R },
  { label: "Target", value: TARGET },
  { label: "Concede", value: CONCEDE },
];

const battlegrounds = states
  .filter((s) => s.classification === "battleground")
  .sort((a, b) => b.ev - a.ev);

const trendByState: Record<string, { delta: string; trend: "up" | "down" | "flat" }> = {
  PA: { delta: "+3.2", trend: "up" },
  MI: { delta: "+0.4", trend: "flat" },
  WI: { delta: "+2.1", trend: "up" },
  NV: { delta: "-0.3", trend: "down" },
};

function Trend({ trend, delta }: { trend: "up" | "down" | "flat"; delta: string }) {
  const sym = trend === "up" ? "↗" : trend === "down" ? "↘" : "→";
  const color = trend === "up" ? "var(--accent-red)" : "var(--fg-60)";
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-mono tabular-nums"
      style={{ color }}
    >
      <span>{sym}</span>
      <span>{delta}</span>
    </span>
  );
}

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 0.4, ease: EASE }}
      className="w-full max-w-[520px] mx-auto card-flat bg-[var(--bg-elev)]"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--hairline)]">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--fg)] opacity-50 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--fg)]" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-[var(--fg-60)]">
            Live · Campaign HQ
          </span>
        </div>
        <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
          Q4 — 2028
        </span>
      </div>

      {/* EV gauge */}
      <div className="px-6 pt-7 pb-6 border-b border-[var(--hairline)]">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow !text-[var(--fg-60)]">Path to 270</span>
          <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">
            {LOCKED} / {THRESHOLD}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <Counter
              to={LOCKED}
              duration={1.8}
              delay={0.6}
              className="font-display text-[88px] md:text-[112px] tabular-nums leading-[0.92]"
            />
            <div className="mt-2 font-mono text-[10px] tracking-[0.06em] uppercase text-[var(--fg-60)]">
              Locked EV
            </div>
          </div>
        </div>

        <div className="mt-6 h-[3px] bg-[var(--hairline)] overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${BAR_PCT}%` }}
            transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
            className="h-full bg-[var(--accent-red)]"
          />
        </div>
        <div className="mt-2 font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
          {THRESHOLD - LOCKED > 0
            ? `${THRESHOLD - LOCKED} more EV needed from ${TARGET} battleground`
            : `${LOCKED - THRESHOLD} EV cushion above threshold`}
        </div>
      </div>

      {/* Coalition tiles */}
      <div className="grid grid-cols-4 border-b border-[var(--hairline)]">
        {coalitions.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.06, ease: EASE }}
            className={`px-4 py-5 ${i < 3 ? "border-r border-[var(--hairline)]" : ""}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--fg-40)]">
              {c.label}
            </div>
            <div className="font-display mt-3 text-[24px] tabular-nums leading-none">
              <Counter to={c.value} duration={1.4} delay={0.9 + i * 0.06} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Focus states */}
      <div className="px-6 pt-5 pb-6">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow !text-[var(--fg-60)]">Focus states</span>
          <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">
            {TARGET} EV · {battlegrounds.length} states
          </span>
        </div>
        <ul className="mt-4 divide-y divide-[var(--hairline)]">
          {battlegrounds.map((s, i) => {
            const t = trendByState[s.id] ?? { delta: "+0.0", trend: "flat" as const };
            return (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1 + i * 0.05, ease: EASE }}
                className="py-3 grid grid-cols-[1fr_auto_auto] items-baseline gap-4"
              >
                <span className="text-[14px]">{s.name}</span>
                <span className="font-mono text-[11px] tabular-nums text-[var(--fg-40)]">
                  {s.ev} EV
                </span>
                <Trend trend={t.trend} delta={t.delta} />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
