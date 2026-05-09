"use client";
import { motion } from "framer-motion";
import Counter from "./Counter";
import TiltCard from "./TiltCard";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const coalitions = [
  { label: "Safe", value: 209, dot: "#C45561" },
  { label: "Lean", value: 43, dot: "#E08894" },
  { label: "Target", value: 50, dot: "#C9A227" },
  { label: "Concede", value: 236, dot: "#3A4B6B" },
];

const focus = [
  { name: "Pennsylvania", ev: 19, delta: "+3.2", trend: "up" as const },
  { name: "Michigan", ev: 15, delta: "+0.4", trend: "flat" as const },
  { name: "Wisconsin", ev: 10, delta: "+2.1", trend: "up" as const },
  { name: "Nevada", ev: 6, delta: "-0.3", trend: "down" as const },
];

function Trend({ trend, delta }: { trend: "up" | "down" | "flat"; delta: string }) {
  const color =
    trend === "up" ? "#5BC287" : trend === "down" ? "#E08894" : "var(--ink-muted)";
  const icon =
    trend === "up" ? "↗" : trend === "down" ? "↘" : "→";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-mono tabular-nums"
      style={{ color }}
    >
      <span>{icon}</span>
      <span>{delta}</span>
    </span>
  );
}

function Sparkline({ color = "var(--accent)" }: { color?: string }) {
  // deterministic-ish points
  const points = [4, 7, 5, 9, 6, 11, 9, 13, 10, 15];
  const w = 80;
  const h = 22;
  const max = Math.max(...points);
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.0, ease: EASE }}
      />
    </svg>
  );
}

export default function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.0, delay: 0.4, ease: EASE }}
      className="w-full max-w-[520px] mx-auto"
      data-cursor-hover
    >
      <TiltCard intensity={5} className="glass-strong relative overflow-hidden">
        {/* gradient sheen */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 60% at 80% -10%, rgba(196,85,97,0.18), transparent 60%)",
          }}
        />

        {/* Window chrome */}
        <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#5BC287] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5BC287]" />
            </span>
            <span className="smallcaps">Live · Campaign HQ</span>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-[var(--ink-muted)] tracking-[0.18em]">
            Q4 · 2028
          </span>
        </div>

        {/* EV gauge */}
        <div className="relative px-5 md:px-6 pt-6 pb-5 border-b border-[var(--hairline)]">
          <div className="flex items-baseline justify-between">
            <span className="smallcaps">Path to 270</span>
            <span className="font-mono text-[11px] tabular-nums text-[var(--ink-muted)]">
              252 / 270
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-6">
            <div>
              <Counter
                to={252}
                duration={1.8}
                delay={0.6}
                className="font-display text-[64px] md:text-[80px] leading-none tabular-nums tracking-[-0.03em] text-glow"
              />
              <div className="mt-1 text-[11px] tracking-[0.2em] uppercase text-[var(--ink-muted)]">
                Projected EV
              </div>
            </div>
            <div className="pb-2">
              <Sparkline />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-[6px] rounded-full bg-[var(--bg-elev-2)] overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "93.33%" }}
              transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(to right, #C45561, #E08894 70%, #C9A227)",
                boxShadow: "0 0 12px rgba(196,85,97,0.6)",
              }}
            />
            {/* 270 mark */}
            <span className="absolute right-[6.7%] top-[-3px] h-[12px] w-[1.5px] bg-[var(--ink)]" />
          </div>
        </div>

        {/* Coalition tiles */}
        <div className="relative grid grid-cols-4 border-b border-[var(--hairline)]">
          {coalitions.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 + i * 0.08, ease: EASE }}
              className={`px-4 py-4 ${i < 3 ? "border-r border-[var(--hairline)]" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: c.dot, boxShadow: `0 0 8px ${c.dot}` }}
                />
                <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--ink-muted)]">
                  {c.label}
                </span>
              </div>
              <div className="font-display mt-2 text-2xl tabular-nums tracking-tight">
                <Counter to={c.value} duration={1.4} delay={0.9 + i * 0.08} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Focus states */}
        <div className="relative px-5 md:px-6 pt-5 pb-5">
          <div className="flex items-baseline justify-between">
            <span className="smallcaps">Focus states</span>
            <span className="font-mono text-[10px] tabular-nums text-[var(--ink-muted)]">
              Updated 11:47 PM
            </span>
          </div>
          <ul className="mt-4 divide-y divide-[var(--hairline)]">
            {focus.map((f, i) => (
              <motion.li
                key={f.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.2 + i * 0.08, ease: EASE }}
                className="py-2.5 grid grid-cols-[1fr_auto_auto] items-baseline gap-4"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  <span className="text-[14px]">{f.name}</span>
                </div>
                <span className="font-mono text-[12px] tabular-nums text-[var(--ink-muted)]">
                  {f.ev} EV
                </span>
                <Trend trend={f.trend} delta={f.delta} />
              </motion.li>
            ))}
          </ul>
        </div>
      </TiltCard>
    </motion.div>
  );
}
