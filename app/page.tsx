"use client";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
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

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="container-page relative z-10 pt-24 md:pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4"
          >
            <span className="smallcaps">{candidates.party}</span>
            <span className="h-px flex-1 max-w-[120px] bg-[var(--hairline-strong)]" />
            <span className="font-mono text-[10px] tabular-nums tracking-[0.25em] text-[var(--ink-muted)] uppercase">2028 · “Renew the Republic”</span>
          </motion.div>

          <motion.div style={{ y: titleY, opacity: titleOpacity }}>
            <SplitText
              as="h1"
              className="font-display mt-10 text-[56px] sm:text-[80px] md:text-[112px] lg:text-[128px] leading-[0.92] font-medium tracking-[-0.03em] max-w-[10ch]"
              stagger={0.025}
            >
              Renew the Republic.
            </SplitText>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-xl text-lg md:text-xl text-[var(--ink-muted)] leading-[1.6]"
          >
            {candidates.tagline} Limited government, free markets, strong national defense, and constitutional restoration — the agenda America needs in 2028.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap gap-4 items-center"
          >
            <MagneticButton href="/platform" variant="primary">
              Read the platform <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton href="/strategy" variant="ghost" strength={0.25}>
              See the path to 270
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-[var(--ink-muted)]"
        >
          Scroll
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-px bg-[var(--ink-muted)]"
          />
        </motion.div>
      </section>

      {/* ================= TICKET ================= */}
      <section className="container-page py-32 md:py-40">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-16">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">01</span>
            <span className="smallcaps">The Ticket</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
        </SectionReveal>

        <SplitText
          as="h2"
          className="font-display text-4xl md:text-7xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[18ch]"
          splitBy="word"
          stagger={0.06}
        >
          A serious ticket for a serious moment.
        </SplitText>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          <SectionReveal delay={0.05}>
            <TiltCard intensity={6} className="glass-strong p-10 md:p-12 h-full">
              <div className="smallcaps">For President</div>
              <div className="font-display mt-5 text-5xl md:text-6xl tracking-[-0.02em] font-medium leading-[0.95]">{candidates.president.name}</div>
              <div className="text-[var(--ink-muted)] text-sm mt-3">{candidates.president.state}</div>
              <p className="mt-8 text-[var(--ink-muted)] leading-[1.7] max-w-prose">{candidates.president.bio}</p>
            </TiltCard>
          </SectionReveal>
          <SectionReveal delay={0.12}>
            <TiltCard intensity={6} className="glass-strong p-10 md:p-12 h-full">
              <div className="smallcaps">For Vice President</div>
              <div className="font-display mt-5 text-5xl md:text-6xl tracking-[-0.02em] font-medium leading-[0.95]">{candidates.vp.name}</div>
              <p className="mt-8 text-[var(--ink-muted)] leading-[1.7] max-w-prose">{candidates.vp.bio}</p>
            </TiltCard>
          </SectionReveal>
        </div>
      </section>

      {/* ================= PILLARS ================= */}
      <section className="container-page py-32 md:py-40">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-16">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">02</span>
            <span className="smallcaps">What we believe</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
        </SectionReveal>

        <SplitText
          as="h2"
          className="font-display text-4xl md:text-7xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[16ch]"
          splitBy="word"
          stagger={0.05}
        >
          Four ideas, in plain language.
        </SplitText>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <SectionReveal key={p.title} delay={0.05 * i}>
              <TiltCard intensity={5} className="glass p-10 h-full">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[var(--accent)] text-sm tabular-nums">{p.i}</span>
                  <span className="flex-1 h-px bg-[var(--hairline)]" />
                </div>
                <div className="font-display mt-8 text-3xl md:text-4xl tracking-[-0.02em] font-medium leading-tight">{p.title}</div>
                <div className="mt-5 text-[var(--ink-muted)] leading-[1.7] max-w-md">{p.body}</div>
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ================= SLOGAN ================= */}
      <section className="relative py-40 md:py-56 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-90 pointer-events-none"
          style={{
            background:
              "radial-gradient(60vw 60vh at 50% 50%, rgba(196,85,97,0.30), transparent 60%)",
          }}
        />
        <div className="container-page relative">
          <SectionReveal>
            <div className="smallcaps text-center">Slogan</div>
            <SplitText
              as="h2"
              className="font-display block text-center mt-8 text-[48px] sm:text-[72px] md:text-[112px] lg:text-[136px] tracking-[-0.03em] font-medium leading-[0.95]"
              stagger={0.03}
            >
              Renew the Republic.
            </SplitText>
            <p className="mt-12 max-w-2xl mx-auto text-center text-[var(--ink-muted)] leading-[1.7] text-lg">
              Not a slogan about grievance. Not a slogan about nostalgia. A slogan about the work — the unromantic, demanding work of running a constitutional republic the way the Founders meant for it to be run.
            </p>
            <div className="mt-12 flex justify-center">
              <MagneticButton href="/address" variant="primary">
                Read the State of the Union <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
