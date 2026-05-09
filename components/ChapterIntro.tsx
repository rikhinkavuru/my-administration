"use client";
import { motion } from "framer-motion";
import SplitText from "./SplitText";

export default function ChapterIntro({
  index,
  kicker,
  title,
  lede,
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="relative pt-28 md:pt-44 pb-16 md:pb-24 overflow-hidden">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-6"
        >
          <span className="font-mono text-[var(--accent)] text-xs tabular-nums tracking-[0.25em]">{index}</span>
          <span className="smallcaps">{kicker}</span>
          <span className="flex-1 gradient-rule" />
        </motion.div>

        <SplitText
          as="h1"
          className="font-display mt-10 text-[44px] sm:text-6xl md:text-[88px] lg:text-[104px] leading-[0.96] font-medium tracking-[-0.025em] max-w-[18ch]"
          stagger={0.018}
          delay={0.1}
        >
          {title}
        </SplitText>

        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-2xl text-lg md:text-xl text-[var(--ink-muted)] leading-[1.6]"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </header>
  );
}
