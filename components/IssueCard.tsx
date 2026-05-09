"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "./Icons";
import type { Issue } from "@/lib/data/platform";

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      whileHover={{ scale: 1.015 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] hover:border-[var(--accent)]/50 transition-colors"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-6 flex items-start gap-4"
      >
        <div className="font-mono text-xs text-[var(--accent)] pt-1 w-8 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="flex-1">
          <div className="text-lg md:text-xl font-semibold tracking-tight">{issue.title}</div>
          <div className="text-sm text-[var(--fg-muted)] mt-1">{issue.summary}</div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-[var(--fg-muted)] pt-1">
          <ChevronDown size={18} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[4.5rem] text-[var(--fg-muted)] leading-relaxed">
              {issue.body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
