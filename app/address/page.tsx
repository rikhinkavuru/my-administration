"use client";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import { stateOfTheUnion } from "@/lib/data/address";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

export default function AddressPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  return (
    <div ref={ref}>
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: progress, transformOrigin: "left" }}
        className="fixed left-0 right-0 top-16 h-[2px] bg-[var(--accent)] z-30 origin-left"
      />

      <header className="relative pt-28 md:pt-44 pb-16 md:pb-20 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-80 pointer-events-none"
          style={{ background: "radial-gradient(40vw 40vh at 20% 30%, rgba(196,85,97,0.22), transparent 60%)" }}
        />
        <div className="container-page relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4"
          >
            <span className="font-mono text-xs text-[var(--accent)] tabular-nums tracking-[0.25em]">06</span>
            <span className="smallcaps">State of the Union, 2029</span>
            <span className="flex-1 h-px bg-[var(--hairline)] max-w-[200px]" />
          </motion.div>

          <SplitText
            as="h1"
            stagger={0.025}
            className="font-display mt-10 text-5xl md:text-7xl lg:text-[96px] tracking-[-0.025em] font-medium leading-[0.96] max-w-[18ch] text-glow"
          >
            My fellow Americans.
          </SplitText>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap gap-2"
          >
            {stateOfTheUnion.themes.map((t, i) => (
              <span
                key={t}
                className="glass text-xs text-[var(--ink-muted)] rounded-full px-4 py-2"
              >
                <span className="font-mono text-[var(--accent)] mr-2 tabular-nums">0{i + 1}</span>
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </header>

      <section className="container-page py-16 md:py-24">
        <article className="font-display mx-auto max-w-[64ch] text-[19px] md:text-[21px] leading-[1.85] text-[var(--ink)] space-y-10">
          {stateOfTheUnion.paragraphs.map((p, i) => (
            <SectionReveal key={i} delay={i * 0.04}>
              <p className={i === 0 ? "dropcap" : ""}>{p}</p>
            </SectionReveal>
          ))}
          <SectionReveal>
            <div
              className="pt-12 mt-8 border-t border-[var(--hairline)] text-[var(--ink-muted)] text-sm not-italic"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Delivered to a Joint Session of the 121st Congress.
            </div>
          </SectionReveal>
        </article>
      </section>
    </div>
  );
}
