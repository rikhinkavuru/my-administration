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
const TOTAL_EV = 538;
const BAR_PCT = Math.min((LOCKED / THRESHOLD) * 100, 100);
const THRESHOLD_PCT = (THRESHOLD / TOTAL_EV) * 100;

const coalitions = [
  { label: "Safe", value: SAFE_R, intensity: 1.0 },
  { label: "Lean", value: LEAN_R, intensity: 0.62 },
  { label: "Target", value: TARGET, intensity: 0.36 },
  { label: "Concede", value: CONCEDE, intensity: 0.18 },
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

// 12-week trendline points for a tiny sparkline (relative deltas, +/-)
// Climbs into LOCKED; never overshoots it (any peak above LOCKED would imply
// a higher prior locked-EV figure than the campaign's current count).
const SPARK = [230, 234, 238, 242, 245, 248, 251, 253, 256, 258, 260, LOCKED];

function Sparkline({ data, width = 92, height = 22 }: { data: number[]; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="block" aria-hidden>
      <motion.polyline
        fill="none"
        stroke="var(--accent-red)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.9, ease: EASE }}
      />
    </svg>
  );
}

function Trend({ trend, delta }: { trend: "up" | "down" | "flat"; delta: string }) {
  const sym = trend === "up" ? "↗" : trend === "down" ? "↘" : "→";
  const color =
    trend === "up" ? "var(--accent-red)" : trend === "down" ? "var(--fg-40)" : "var(--fg-60)";
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
      className="w-full max-w-[520px] mx-auto card-flat bg-[var(--bg-elev)] relative overflow-hidden"
    >
      {/* corner ticks */}
      <span aria-hidden className="pointer-events-none absolute -top-px -left-px h-3 w-3 border-l border-t border-[var(--accent-red)]" />
      <span aria-hidden className="pointer-events-none absolute -top-px -right-px h-3 w-3 border-r border-t border-[var(--accent-red)]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-l border-b border-[var(--accent-red)]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-r border-b border-[var(--accent-red)]" />

      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--hairline)] bg-[var(--bg-elev-2)]">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-red)] opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-red)]" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-[var(--fg-60)]">
            Live · Campaign HQ
          </span>
        </div>
        <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
          Q4 — 2028
        </span>
      </div>

      {/* EV gauge — tightened so the dashboard fits within hero viewport */}
      <div className="px-6 pt-5 pb-4 border-b border-[var(--hairline)]">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow !text-[var(--fg-60)]">Path to 270</span>
          <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">
            {LOCKED} / {THRESHOLD}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-3">
              <Counter
                to={LOCKED}
                duration={1.8}
                delay={0.6}
                className="font-display text-[72px] md:text-[92px] tabular-nums leading-[0.9]"
              />
              <Trend trend="up" delta="+12 wk" />
            </div>
            <div className="mt-2 font-mono text-[10px] tracking-[0.06em] uppercase text-[var(--fg-60)]">
              Locked EV
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 pb-2">
            <Sparkline data={SPARK} />
            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--fg-40)]">
              12-wk trend
            </span>
          </div>
        </div>

        {/* Progress bar with threshold tick */}
        <div className="mt-4 relative">
          <div className="h-[3px] bg-[var(--hairline)] overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${BAR_PCT}%` }}
              transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
              className="h-full bg-[var(--accent-red)]"
            />
          </div>
          {/* Threshold tick at 270 (270/538 of full range from left, mapped relative to bar) */}
          <span
            aria-hidden
            className="absolute -top-1 h-[7px] w-px bg-[var(--fg)]"
            style={{ left: `100%` }}
          />
          <span
            aria-hidden
            className="absolute -bottom-3 font-mono text-[9px] text-[var(--fg-40)] tracking-[0.06em]"
            style={{ left: `calc(100% - 1.2ch)` }}
          >
            270
          </span>
          <span
            aria-hidden
            className="absolute -bottom-3 left-0 font-mono text-[9px] text-[var(--fg-40)] tracking-[0.06em]"
          >
            0
          </span>
        </div>
        <div className="mt-7 font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
          {THRESHOLD - LOCKED > 0
            ? `${THRESHOLD - LOCKED} more EV needed from ${TARGET} battleground`
            : `${LOCKED - THRESHOLD} EV cushion above threshold`}
        </div>
        {THRESHOLD - LOCKED > 0 && (
          <div className="text-[9px] uppercase tracking-[0.08em] font-mono mt-1 text-[var(--accent-red)]">
            Confidence — Moderate ↗
          </div>
        )}
      </div>

      {/* Coalition tiles */}
      <div className="grid grid-cols-4 border-b border-[var(--hairline)]">
        {coalitions.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.06, ease: EASE }}
            className={`px-4 py-5 ${i < 3 ? "border-r border-[var(--hairline)]" : ""} relative`}
          >
            {/* intensity bar */}
            <span
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `rgba(214, 61, 68, ${c.intensity * 0.7})` }}
            />
            <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--fg-40)]">
              {c.label}
            </div>
            <div className="font-display mt-3 text-[26px] tabular-nums leading-none">
              <Counter to={c.value} duration={1.4} delay={0.9 + i * 0.06} />
            </div>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.06em] text-[var(--fg-40)] tabular-nums">
              EV
            </div>
          </motion.div>
        ))}
      </div>

      {/* Focus states */}
      <div className="px-6 pt-4 pb-4">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow !text-[var(--fg-60)]">Focus states</span>
          <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">
            {TARGET} EV · {battlegrounds.length} states
          </span>
        </div>
        <ul className="mt-3 divide-y divide-[var(--hairline)]">
          {battlegrounds.map((s, i) => {
            const t = trendByState[s.id] ?? { delta: "+0.0", trend: "flat" as const };
            return (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1 + i * 0.05, ease: EASE }}
                className="py-2 grid grid-cols-[auto_1fr_auto_auto] items-baseline gap-4"
              >
                <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
