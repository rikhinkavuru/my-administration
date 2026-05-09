"use client";
import { motion } from "framer-motion";
import type { CabinetPick } from "@/lib/data/cabinet";

export default function CabinetCard({ pick, index }: { pick: CabinetPick; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="card flex flex-col h-full"
    >
      <div className="p-6 flex items-center justify-between border-b border-[var(--hairline)]">
        <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums">
          {String(index + 1).padStart(2, "0")} / 15
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-60)]">
          Nominee
        </span>
      </div>
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="eyebrow !text-[var(--fg-40)]">{pick.department}</div>
        <div className="font-display mt-5 text-[32px] md:text-[36px] leading-[0.96]">
          {pick.nominee}
        </div>
        <div className="mt-5 text-[13px] md:text-[14px] leading-[1.7] text-[var(--fg-60)]">
          {pick.justification}
        </div>
      </div>
    </motion.div>
  );
}
