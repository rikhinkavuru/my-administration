"use client";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ChapterIntro({
  index,
  kicker,
  title,
  italicAccent,
  lede,
}: {
  index: string;
  kicker: string;
  title: string;
  italicAccent?: string;
  lede?: string;
}) {
  return (
    <header className="relative pt-28 md:pt-40 pb-16 md:pb-24 border-b border-[var(--hairline)]">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="font-mono text-[11px] tabular-nums text-[var(--accent-red)] tracking-[0.06em]">
            [{index}]
          </span>
          <span className="eyebrow !text-[var(--fg-60)]">{kicker}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
          className="font-display mt-10 text-[44px] sm:text-[72px] md:text-[104px] lg:text-[120px] max-w-[18ch]"
        >
          {title}
          {italicAccent && (
            <>
              {" "}
              <span className="font-serif-italic text-[var(--accent-red)]">{italicAccent}</span>
            </>
          )}
        </motion.h1>
        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.32, ease: EASE }}
            className="mt-10 max-w-2xl text-base md:text-lg text-[var(--fg-60)] leading-[1.55]"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </header>
  );
}
