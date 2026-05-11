"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "./Icons";
import type { Issue } from "@/lib/data/platform";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.04, ease: EASE }}
      className={`card relative group ${open ? "border-[var(--hairline-strong)] bg-[var(--bg-elev-2)]" : ""}`}
    >
      {/* Accent left rail when open */}
      <span
        aria-hidden
        className={`absolute left-0 top-0 bottom-0 w-px transition-colors duration-300 ${
          open ? "bg-[var(--accent-red)]" : "bg-transparent"
        }`}
      />
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left p-7 md:p-9 grid grid-cols-[3.5rem_1fr_auto] gap-5 items-start"
      >
        <div className="font-mono text-[11px] text-[var(--fg-40)] tabular-nums pt-2 tracking-[0.06em]">
          [ {String(index + 1).padStart(2, "0")} ]
        </div>
        <div>
          <div className="font-display text-[28px] md:text-[40px] leading-[1] tracking-[-0.03em] transition-colors group-hover:text-[var(--fg)]">
            {issue.title}
          </div>
          <div className="mt-3 text-[var(--fg-60)] text-[14px] md:text-[15px] leading-[1.6] max-w-2xl">
            {issue.summary}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`mt-2 transition-colors ${open ? "text-[var(--accent-red)]" : "text-[var(--fg-60)]"}`}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-7 md:px-9 pl-[calc(3.5rem+1.25rem)] pb-7 md:pb-9 max-w-3xl text-[var(--fg-60)] leading-[1.75] text-[14px] md:text-[15px] border-t border-[var(--hairline)] pt-6">
              {issue.body}
              <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-40)]">
                <span className="inline-block h-px w-6 bg-[var(--accent-red)]" />
                Position — Sackett / Kavuru
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
