"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "./Icons";
import type { Issue } from "@/lib/data/platform";
import TiltCard from "./TiltCard";

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.85, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard intensity={4} className="glass overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full text-left p-7 md:p-8 flex items-start gap-5"
        >
          <div className="font-mono text-xs text-[var(--accent)] tabular-nums pt-1.5 w-10 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="flex-1">
            <div className="font-display text-2xl md:text-[28px] tracking-tight font-medium leading-tight">
              {issue.title}
            </div>
            <div className="mt-2.5 text-[var(--ink-muted)] text-[15px] leading-relaxed">
              {issue.summary}
            </div>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
              <div className="px-7 md:px-8 pl-[calc(2.5rem+1.25rem)] pb-7 md:pb-8 max-w-3xl text-[var(--ink-muted)] leading-[1.75] text-[15px] border-t border-[var(--hairline)] pt-5">
                {issue.body}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </TiltCard>
    </motion.div>
  );
}
