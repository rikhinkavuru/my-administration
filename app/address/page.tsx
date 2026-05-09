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
      <motion.div
        style={{ scaleX: progress, transformOrigin: "left" }}
        className="fixed left-0 right-0 top-16 h-[2px] bg-[var(--fg)] z-30 origin-left"
      />

      <header className="relative pt-28 md:pt-40 pb-16 md:pb-20 border-b border-[var(--hairline)]">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3"
          >
            <span className="font-mono text-[11px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
              [06]
            </span>
            <span className="eyebrow">State of the Union, 2029</span>
          </motion.div>

          <SplitText
            as="h1"
            stagger={0.025}
            className="font-display mt-10 text-[56px] md:text-[88px] lg:text-[120px] max-w-[18ch]"
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
                className="text-[11px] text-[var(--fg-60)] border border-[var(--hairline-strong)] rounded-full px-3 py-1.5 font-mono tracking-[0.06em] uppercase"
              >
                <span className="text-[var(--accent-red)] mr-1.5">0{i + 1}</span>
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </header>

      <section className="container-page py-16 md:py-24">
        <article className="font-serif-italic mx-auto max-w-[64ch] text-[19px] md:text-[21px] leading-[1.85] text-[var(--fg)] space-y-10 not-italic" style={{ fontStyle: "normal", fontFamily: "var(--font-noto-serif), Georgia, serif" }}>
          {stateOfTheUnion.paragraphs.map((p, i) => (
            <SectionReveal key={i} delay={i * 0.04}>
              <p className={i === 0 ? "dropcap" : ""}>{p}</p>
            </SectionReveal>
          ))}
          <SectionReveal>
            <div
              className="pt-12 mt-8 border-t border-[var(--hairline)] text-[var(--fg-40)] text-[12px] font-mono uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-kode-mono), monospace" }}
            >
              Delivered to a Joint Session of the 121st Congress.
            </div>
          </SectionReveal>
        </article>
      </section>
    </div>
  );
}
