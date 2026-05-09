"use client";
import { motion } from "framer-motion";
import type { CabinetPick } from "@/lib/data/cabinet";

export default function CabinetCard({ pick, index }: { pick: CabinetPick; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.65, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group relative py-7 px-6 border-b border-[var(--hairline)] sm:border-b sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
    >
      <div className="smallcaps">{pick.department}</div>
      <div className="mt-3 font-display text-2xl tracking-tight font-medium leading-tight transition-colors group-hover:text-[var(--accent)]">
        {pick.nominee}
      </div>
      <div className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)]">
        {pick.justification}
      </div>
    </motion.div>
  );
}
