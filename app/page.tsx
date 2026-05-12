"use client";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import RotatingWord from "@/components/RotatingWord";
import MagneticButton from "@/components/MagneticButton";
import HeroDashboard from "@/components/HeroDashboard";
import StatBand from "@/components/StatBand";
import Marquee from "@/components/Marquee";
import JetSequence from "@/components/jet/JetSequence";
import { candidates } from "@/lib/data/candidates";
import { evByClass, states } from "@/lib/data/states";
import { ArrowRight } from "@/components/Icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const pillars = [
  {
    i: "01",
    title: "Limited government",
    body: "A federal government that does fewer things, but does them well.",
  },
  {
    i: "02",
    title: "Free markets",
    body: "Growth, competition, and opportunity — not central planning.",
  },
  {
    i: "03",
    title: "Strong defense",
    body: "Peace through strength. Alliances that work. A navy fit for the century.",
  },
  {
    i: "04",
    title: "Constitutional order",
    body: "Originalist judges. Federalism. A Congress that legislates.",
  },
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

function SectionHeader({ index, label }: { index: string; label: string }) {
  return (
    <SectionReveal>
      <div className="flex items-center gap-4 mb-12">
        <span className="section-marker">[ {index} ]</span>
        <span className="eyebrow">{label}</span>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="origin-left flex-1 h-px bg-[var(--hairline)]"
        />
      </div>
    </SectionReveal>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const dashY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const dashOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const sloganRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sloganProg } = useScroll({
    target: sloganRef,
    offset: ["start end", "end start"],
  });
  const sloganX = useTransform(sloganProg, [0, 1], [-40, 40]);

  return (
    <div>
      {/* ============== HERO ============== */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[100svh] flex items-center overflow-hidden border-b border-[var(--hairline)]"
      >
        {/* Hero grid backdrop */}
        <div aria-hidden className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div aria-hidden className="vignette" />

        {/* Corner brackets */}
        <span aria-hidden className="absolute top-20 left-6 lg:left-8 h-4 w-4 border-l border-t border-[var(--accent-red)] pointer-events-none" />
        <span aria-hidden className="absolute bottom-8 right-6 lg:right-8 h-4 w-4 border-r border-b border-[var(--accent-red)] pointer-events-none" />

        <div className="container-page relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-24 lg:pt-20 pb-12">
          <motion.div style={{ y: titleY, opacity: titleOpacity }} className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow"
            >
              {candidates.party} — 2028 — &ldquo;Renew the Republic&rdquo;
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-display mt-8 tracking-[-0.05em] leading-[1]"
              style={{
                // Cap at 100px so "the Republic." doesn't wrap to two
                // lines inside the 7/12-col container (~820px wide on
                // a 2000px viewport). Also constrained by svh so on
                // short screens the hero stays one viewport.
                fontSize: "clamp(44px, min(7vw, 9.5svh), 100px)",
              }}
            >
              <RotatingWord
                words={["Renew", "Restore", "Rebuild", "Reclaim", "Revive", "Reform"]}
                interval={2800}
                className="text-[var(--accent-red)]"
              />
              <span className="block">
                the <span className="font-serif-italic text-[var(--accent-red)]">Republic.</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 max-w-xl text-[15px] md:text-[18px] text-[var(--fg-60)] leading-[1.6]"
            >
              {candidates.tagline} Limited government, free markets, strong national defense, and constitutional restoration — the agenda America needs in 2028.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap gap-3 items-center"
            >
              <MagneticButton href="/platform" variant="primary">
                Read the platform <ArrowRight size={14} />
              </MagneticButton>
              <MagneticButton href="/strategy" variant="ghost" strength={0.16}>
                See the path to 270
              </MagneticButton>
            </motion.div>

            {/* Micro stat row */}
            <motion.dl
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14 grid grid-cols-3 gap-px bg-[var(--hairline)] border-t border-b border-[var(--hairline)] max-w-md"
            >
              {(() => {
                const lockedEV = evByClass["safe-r"] + evByClass["lean-r"];
                const targetEV = evByClass.battleground;
                const battlegroundCount = states.filter(
                  (s) => s.classification === "battleground",
                ).length;
                return [
                  [String(lockedEV), "Locked EV"],
                  [String(targetEV), "Target EV"],
                  [`[ ${String(battlegroundCount).padStart(2, "0")} ]`, "Battlegrounds"],
                ];
              })().map(([n, l]) => (
                <div key={l} className="bg-[var(--bg)] px-4 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-40)]">{l}</dt>
                  <dd className="font-display text-[24px] md:text-[28px] tabular-nums leading-none mt-1.5">
                    {n}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            style={{ y: dashY, opacity: dashOpacity }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <HeroDashboard />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--fg-40)]">
            Scroll
          </span>
          <motion.span
            aria-hidden
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block h-4 w-px bg-[var(--fg-40)]"
          />
        </motion.div>
      </motion.section>

      {/* ====== JET FLYBY (scroll-linked) wraps the marquee + stat band + ticket ====== */}
      <JetSequence>
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
          <SectionHeader index="02" label="The Ticket" />

          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[44px] sm:text-[68px] md:text-[92px] lg:text-[108px] max-w-[18ch] tracking-[-0.045em]"
          >
            A serious ticket
          </SplitText>
          <p className="font-display text-[44px] sm:text-[68px] md:text-[92px] lg:text-[108px] max-w-[18ch] tracking-[-0.045em]">
            for a serious{" "}
            <span className="font-serif-italic text-[var(--accent-red)]">moment.</span>
          </p>

          <div className="mt-16 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
            <SectionReveal delay={0.05}>
              <div className="bg-[var(--bg)] p-10 md:p-12 h-full relative group">
                <span aria-hidden className="absolute top-0 left-0 h-3 w-3 border-t border-l border-[var(--accent-red)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-baseline justify-between mb-1">
                  <div className="eyebrow !text-[var(--fg-40)]">For President</div>
                  <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
                    01
                  </span>
                </div>
                <div className="font-display mt-6 text-[52px] md:text-[72px] leading-[0.94] tracking-[-0.045em]">
                  {candidates.president.name}
                </div>
                <div className="text-[var(--fg-60)] text-[12px] mt-3 font-mono uppercase tracking-[0.08em] flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-[var(--accent-red)]" />
                  {candidates.president.state}
                </div>
                <p className="mt-8 text-[var(--fg-60)] leading-[1.7] max-w-prose text-[14px] md:text-[15px]">
                  {candidates.president.bio}
                </p>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.12}>
              <div className="bg-[var(--bg)] p-10 md:p-12 h-full relative group">
                <span aria-hidden className="absolute top-0 left-0 h-3 w-3 border-t border-l border-[var(--accent-red)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-baseline justify-between mb-1">
                  <div className="eyebrow !text-[var(--fg-40)]">For Vice President</div>
                  <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
                    02
                  </span>
                </div>
                <div className="font-display mt-6 text-[52px] md:text-[72px] leading-[0.94] tracking-[-0.045em]">
                  {candidates.vp.name}
                </div>
                <div className="text-[var(--fg-60)] text-[12px] mt-3 font-mono uppercase tracking-[0.08em] flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-[var(--accent-red)]" />
                  Policy & Strategy
                </div>
                <p className="mt-8 text-[var(--fg-60)] leading-[1.7] max-w-prose text-[14px] md:text-[15px]">
                  {candidates.vp.bio}
                </p>
              </div>
            </SectionReveal>
          </div>
        </section>
      </JetSequence>

      {/* ============== PILLARS ============== */}
      <section className="container-page py-28 md:py-36">
        <SectionHeader index="03" label="What we believe" />

        <SplitText
          as="h2"
          splitBy="word"
          stagger={0.05}
          className="font-display text-[44px] sm:text-[68px] md:text-[92px] lg:text-[108px] max-w-[18ch] tracking-[-0.045em]"
        >
          Four ideas, in plain
        </SplitText>
        <p className="font-display text-[44px] sm:text-[68px] md:text-[92px] lg:text-[108px] tracking-[-0.045em]">
          <span className="font-serif-italic text-[var(--accent-red)]">language.</span>
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          {pillars.map((p, i) => (
            <SectionReveal key={p.title} delay={0.05 * i}>
              <div className="bg-[var(--bg)] p-10 md:p-12 h-full relative group transition-colors duration-300 hover:bg-[var(--bg-elev)]">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)] tracking-[0.06em]">
                    {p.i} / 04
                  </span>
                  <span className="eyebrow !text-[var(--fg-40)]">Pillar</span>
                </div>
                <div className="font-display mt-10 text-[36px] md:text-[48px] leading-[0.98] tracking-[-0.04em]">
                  {p.title}
                </div>
                <div className="mt-4 h-px w-10 bg-[var(--hairline-strong)] group-hover:bg-[var(--accent-red)] transition-colors duration-300" />
                <div className="mt-5 text-[var(--fg-60)] leading-[1.7] text-[14px] md:text-[15px] max-w-md">
                  {p.body}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ============== SLOGAN ============== */}
      <section
        ref={sloganRef}
        className="py-32 md:py-44 border-y border-[var(--hairline)] relative overflow-hidden"
      >
        <div aria-hidden className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="container-page relative">
          <SectionReveal>
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className="section-marker">[ 04 ]</span>
              <span className="eyebrow">Slogan</span>
            </div>
            <motion.h2
              style={{ x: sloganX }}
              className="font-display block text-center text-[64px] sm:text-[112px] md:text-[180px] lg:text-[220px] leading-[0.88] tracking-[-0.05em]"
            >
              Renew the{" "}
              <span className="font-serif-italic text-[var(--accent-red)]">Republic.</span>
            </motion.h2>
            <p className="mt-14 max-w-2xl mx-auto text-center text-[var(--fg-60)] leading-[1.65] text-[16px] md:text-[18px]">
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
