"use client";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const badges = [
  { label: "To win", value: "270", suffix: "EV", x: "-58%", y: "-44%", delay: 1.2 },
  { label: "States", value: "50", suffix: "", x: "58%", y: "-32%", delay: 1.4 },
  { label: "Positions", value: "12", suffix: "", x: "-62%", y: "40%", delay: 1.6 },
  { label: "Cabinet", value: "15", suffix: "", x: "60%", y: "42%", delay: 1.8 },
];

export default function StatBadges() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      {badges.map((b) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: b.delay, ease: EASE }}
          className="absolute top-1/2 left-1/2"
          style={{ transform: `translate(calc(-50% + ${b.x}), calc(-50% + ${b.y}))` }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
            className="glass px-4 py-3 min-w-[120px]"
          >
            <div className="smallcaps !text-[9px]">{b.label}</div>
            <div className="font-display mt-1 text-2xl tabular-nums leading-none">
              {b.value}
              {b.suffix && (
                <span className="text-[var(--ink-muted)] text-xs ml-1 font-sans align-middle">{b.suffix}</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
