"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "./Icons";
import type { Issue } from "@/lib/data/platform";

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="card"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-7 md:p-8 grid grid-cols-[3.5rem_1fr_auto] gap-5 items-start group"
      >
        <div className="font-mono text-[11px] text-[var(--fg-40)] tabular-nums pt-2">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <div className="font-display text-[28px] md:text-[40px] leading-[1] tracking-[-0.03em]">
            {issue.title}
          </div>
          <div className="mt-3 text-[var(--fg-60)] text-[14px] md:text-[15px] leading-[1.6]">
            {issue.summary}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[var(--fg-60)] mt-2"
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
            <div className="px-7 md:px-8 pl-[calc(3.5rem+1.25rem)] pb-7 md:pb-8 max-w-3xl text-[var(--fg-60)] leading-[1.7] text-[14px] md:text-[15px] border-t border-[var(--hairline)] pt-5">
              {issue.body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
