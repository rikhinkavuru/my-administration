"use client";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import { stateOfTheUnion } from "@/lib/data/address";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function AddressClient() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const pctText = useTransform(progress, (v) =>
    `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`,
  );

  const wordCount = stateOfTheUnion.paragraphs.reduce(
    (sum, p) => sum + p.trim().split(/\s+/).length,
    0,
  );
  const readMinutes = Math.max(1, Math.round(wordCount / 130));

  return (
    <div ref={ref}>
      {/* Reading progress */}
      <motion.div
        style={{ scaleX: progress, transformOrigin: "left" }}
        className="fixed left-0 right-0 top-16 h-[2px] bg-[var(--accent-red)] z-30 origin-left"
        aria-hidden
      />
      <motion.div
        aria-hidden
        className="fixed right-4 top-[68px] z-30 font-mono text-[10px] tabular-nums tracking-[0.08em] uppercase text-[var(--fg-60)] bg-[var(--bg)]/70 backdrop-blur-sm px-2 py-1 border border-[var(--hairline)]"
      >
        <motion.span>{pctText}</motion.span>
      </motion.div>

      <header className="relative pt-28 md:pt-36 pb-16 md:pb-20 border-b border-[var(--hairline)]">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3"
          >
            <span className="font-mono text-[11px] text-[var(--accent-red)] tabular-nums tracking-[0.06em]">
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

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: EASE }}
            className="mt-10 max-w-2xl text-base md:text-lg text-[var(--fg-60)] leading-[1.6]"
          >
            Delivered to a Joint Session of the 121st Congress on the night of
            our first inauguration. A serious moment. A serious agenda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.6, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-2"
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
            <span className="ml-auto font-mono text-[10px] tabular-nums tracking-[0.08em] uppercase text-[var(--fg-40)]">
              {wordCount} words · ~{readMinutes} min read
            </span>
          </motion.div>
        </div>
      </header>

      <section className="container-page py-16 md:py-24">
        <article
          className="mx-auto max-w-[64ch] text-[19px] md:text-[21px] leading-[1.85] text-[var(--fg)] space-y-10"
          style={{ fontFamily: "var(--font-noto-serif), Georgia, serif" }}
        >
          {stateOfTheUnion.paragraphs.map((p, i) => (
            <SectionReveal key={i} delay={i * 0.04}>
              <p className={i === 0 ? "dropcap" : ""}>{p}</p>
            </SectionReveal>
          ))}
          <SectionReveal>
            <footer
              className="pt-12 mt-8 border-t border-[var(--hairline)] grid sm:grid-cols-[1fr_auto] gap-4 items-baseline text-[var(--fg-40)] text-[12px] uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-kode-mono), monospace" }}
            >
              <div>Delivered to a Joint Session of the 121st Congress.</div>
              <div className="text-[var(--accent-red)]">— Sackett</div>
            </footer>
          </SectionReveal>
        </article>
      </section>
    </div>
  );
}
