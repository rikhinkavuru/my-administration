"use client";
import { motion } from "framer-motion";
import type { CabinetPick } from "@/lib/data/cabinet";
import TiltCard from "./TiltCard";

export default function CabinetCard({ pick, index }: { pick: CabinetPick; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.85, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard intensity={6} className="glass p-7 md:p-8 h-full">
        <div className="smallcaps">{pick.department}</div>
        <div className="font-display mt-4 text-[28px] md:text-[32px] tracking-tight font-medium leading-[1.05]">
          {pick.nominee}
        </div>
        <div className="mt-4 text-[14px] leading-[1.7] text-[var(--ink-muted)]">
          {pick.justification}
        </div>
        <div className="mt-6 font-mono text-[10px] tabular-nums text-[var(--ink-faint)]">
          NOMINEE · {String(index + 1).padStart(2, "0")}/15
        </div>
      </TiltCard>
    </motion.div>
  );
}
