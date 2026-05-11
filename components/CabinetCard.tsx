"use client";
import { motion } from "framer-motion";
import type { CabinetPick } from "@/lib/data/cabinet";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function CabinetCard({ pick, index }: { pick: CabinetPick; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.04, ease: EASE }}
      className="card flex flex-col h-full relative group"
    >
      {/* hover accent corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t border-r border-transparent group-hover:border-[var(--accent-red)] transition-colors duration-300"
      />
      <div className="px-7 py-5 flex items-center justify-between border-b border-[var(--hairline)]">
        <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
          {String(index + 1).padStart(2, "0")} / 15
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--accent-red)] flex items-center gap-2">
          <span className="inline-block h-1 w-1 rounded-full bg-[var(--accent-red)]" />
          Nominee
        </span>
      </div>
      <div className="p-7 md:p-8 flex-1 flex flex-col">
        <div className="eyebrow !text-[var(--fg-40)]">{pick.department}</div>
        <div className="font-display mt-5 text-[30px] md:text-[38px] leading-[0.98] tracking-[-0.035em]">
          {pick.nominee}
        </div>
        <div className="mt-5 h-px w-10 bg-[var(--hairline-strong)] group-hover:bg-[var(--accent-red)] transition-colors duration-300" />
        <div className="mt-5 text-[13px] md:text-[14px] leading-[1.7] text-[var(--fg-60)] flex-1">
          {pick.justification}
        </div>
      </div>
    </motion.div>
  );
}
