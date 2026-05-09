"use client";
import { motion } from "framer-motion";
import type { CabinetPick } from "@/lib/data/cabinet";

export default function CabinetCard({ pick, index }: { pick: CabinetPick; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 5) * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 hover:border-[var(--accent)]/60 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_8px_30px_-12px_rgba(212,175,55,0.25)] transition-all"
    >
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)]">
        {pick.department}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{pick.nominee}</div>
      <div className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
        {pick.justification}
      </div>
    </motion.div>
  );
}
