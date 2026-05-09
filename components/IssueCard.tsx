"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "./Icons";
import type { Issue } from "@/lib/data/platform";

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-[var(--hairline)]"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left py-7 grid grid-cols-[3rem_1fr_auto] gap-6 items-baseline group"
      >
        <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums pt-1">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <div className="font-display text-2xl md:text-3xl tracking-tight font-medium leading-tight transition-colors group-hover:text-[var(--accent)]">
            {issue.title}
          </div>
          <div className="mt-2 text-[var(--ink-muted)] text-[15px] leading-relaxed max-w-2xl">
            {issue.summary}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[var(--ink-muted)] mt-2"
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-[4.5rem] pr-12 pb-8 max-w-3xl text-[var(--ink-muted)] leading-[1.75] text-[15px]">
              {issue.body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
