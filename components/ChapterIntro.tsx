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
    <header className="relative pt-28 md:pt-40 pb-16 md:pb-24 border-b border-[var(--hairline)] overflow-hidden">
      {/* faint grid backdrop */}
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="section-marker">[ {index} ]</span>
          <span className="eyebrow !text-[var(--fg-60)]">{kicker}</span>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            className="origin-left flex-1 h-px bg-[var(--hairline)] ml-2 hidden sm:block"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
          className="font-display mt-10 text-[48px] sm:text-[80px] md:text-[112px] lg:text-[136px] max-w-[18ch] tracking-[-0.045em]"
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
            transition={{ duration: 0.85, delay: 0.36, ease: EASE }}
            className="mt-10 max-w-2xl text-[15px] md:text-[18px] text-[var(--fg-60)] leading-[1.6]"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </header>
  );
}
