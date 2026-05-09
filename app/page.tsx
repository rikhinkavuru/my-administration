"use client";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import RotatingWord from "@/components/RotatingWord";
import MagneticButton from "@/components/MagneticButton";
import HeroDashboard from "@/components/HeroDashboard";
import StatBand from "@/components/StatBand";
import Marquee from "@/components/Marquee";
import { candidates } from "@/lib/data/candidates";
import { ArrowRight } from "@/components/Icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const pillars = [
  { i: "01", title: "Limited government", body: "A federal government that does fewer things, but does them well." },
  { i: "02", title: "Free markets", body: "Growth, competition, and opportunity — not central planning." },
  { i: "03", title: "Strong defense", body: "Peace through strength. Alliances that work. A navy fit for the century." },
  { i: "04", title: "Constitutional order", body: "Originalist judges. Federalism. A Congress that legislates." },
];

const marqueeItems = [
  "Renew",
  "Restore",
  "Rebuild",
  "Reclaim",
  "Revive",
  "Reform",
  "Republic",
  "Refound",
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const dashY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div>
      {/* ============== HERO ============== */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center overflow-hidden border-b border-[var(--hairline)]"
      >
        <div className="container-page relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-28 lg:pt-24 pb-20">
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow"
            >
              {candidates.party} — 2028 — “Renew the Republic”
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display mt-8 text-[60px] sm:text-[88px] md:text-[112px] lg:text-[128px] xl:text-[152px]"
            >
              <RotatingWord
                words={["Renew", "Restore", "Rebuild", "Reclaim", "Revive", "Reform"]}
                interval={1700}
                className="text-[var(--accent-red)]"
              />
              <span className="block">
                the <span className="font-serif-italic text-[var(--accent-red)]">Republic.</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 max-w-xl text-[15px] md:text-[17px] text-[var(--fg-60)] leading-[1.6]"
            >
              {candidates.tagline} Limited government, free markets, strong national defense, and constitutional restoration — the agenda America needs in 2028.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <MagneticButton href="/platform" variant="primary">
                Read the platform <ArrowRight size={14} />
              </MagneticButton>
              <MagneticButton href="/strategy" variant="ghost" strength={0.18}>
                See the path to 270
              </MagneticButton>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: dashY }} className="lg:col-span-5">
            <HeroDashboard />
          </motion.div>
        </div>
      </section>

      {/* ============== MARQUEE ============== */}
      <Marquee items={marqueeItems} />

      {/* ============== STAT BAND ============== */}
      <StatBand
        metric={270}
        label="[ 01 ] The number that matters"
        context="Two hundred seventy electoral votes is the threshold. Most campaigns drift; few get there. This one has a path —"
        italicAccent="a serious one."
      />

      {/* ============== TICKET ============== */}
      <section className="container-page py-28 md:py-36">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">[ 02 ]</span>
            <span className="eyebrow">The Ticket</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
        </SectionReveal>

        <SplitText
          as="h2"
          splitBy="word"
          stagger={0.05}
          className="font-display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px] max-w-[18ch]"
        >
          A serious ticket
        </SplitText>
        <p className="font-display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px] max-w-[18ch]">
          for a serious{" "}
          <span className="font-serif-italic text-[var(--accent-red)]">moment.</span>
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          <SectionReveal delay={0.05}>
            <div className="bg-[var(--bg)] p-10 md:p-12 h-full">
              <div className="eyebrow !text-[var(--fg-40)]">For President</div>
              <div className="font-display mt-6 text-[48px] md:text-[64px] leading-[0.96]">
                {candidates.president.name}
              </div>
              <div className="text-[var(--fg-60)] text-[13px] mt-3 font-mono uppercase tracking-[0.06em]">
                {candidates.president.state}
              </div>
              <p className="mt-8 text-[var(--fg-60)] leading-[1.7] max-w-prose text-[14px] md:text-[15px]">
                {candidates.president.bio}
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.12}>
            <div className="bg-[var(--bg)] p-10 md:p-12 h-full">
              <div className="eyebrow !text-[var(--fg-40)]">For Vice President</div>
              <div className="font-display mt-6 text-[48px] md:text-[64px] leading-[0.96]">
                {candidates.vp.name}
              </div>
              <p className="mt-8 text-[var(--fg-60)] leading-[1.7] max-w-prose text-[14px] md:text-[15px]">
                {candidates.vp.bio}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ============== PILLARS ============== */}
      <section className="container-page py-28 md:py-36">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">[ 03 ]</span>
            <span className="eyebrow">What we believe</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
        </SectionReveal>

        <SplitText
          as="h2"
          splitBy="word"
          stagger={0.05}
          className="font-display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px] max-w-[18ch]"
        >
          Four ideas, in plain
        </SplitText>
        <p className="font-display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px]">
          <span className="font-serif-italic text-[var(--accent-red)]">language.</span>
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          {pillars.map((p, i) => (
            <SectionReveal key={p.title} delay={0.05 * i}>
              <div className="bg-[var(--bg)] p-10 h-full">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">{p.i} / 04</span>
                  <span className="eyebrow !text-[var(--fg-40)]">Pillar</span>
                </div>
                <div className="font-display mt-8 text-[36px] md:text-[44px] leading-[0.98]">{p.title}</div>
                <div className="mt-5 text-[var(--fg-60)] leading-[1.7] text-[14px] md:text-[15px] max-w-md">
                  {p.body}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ============== SLOGAN ============== */}
      <section className="py-32 md:py-44 border-y border-[var(--hairline)]">
        <div className="container-page">
          <SectionReveal>
            <div className="eyebrow text-center">Slogan</div>
            <h2 className="font-display block text-center mt-10 text-[64px] sm:text-[112px] md:text-[164px] lg:text-[200px] leading-[0.92]">
              Renew the{" "}
              <span className="font-serif-italic text-[var(--accent-red)]">Republic.</span>
            </h2>
            <p className="mt-12 max-w-2xl mx-auto text-center text-[var(--fg-60)] leading-[1.7] text-[15px] md:text-[17px]">
              Not a slogan about grievance. Not a slogan about nostalgia. A slogan about the work — the unromantic, demanding work of running a constitutional republic the way the Founders meant for it to be run.
            </p>
            <div className="mt-12 flex justify-center">
              <MagneticButton href="/address" variant="primary">
                Read the State of the Union <ArrowRight size={14} />
              </MagneticButton>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
