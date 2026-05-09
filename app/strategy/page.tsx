"use client";
import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import ElectoralMapWrapper from "@/components/ElectoralMapWrapper";
import Counter from "@/components/Counter";
import TiltCard from "@/components/TiltCard";
import { motion } from "framer-motion";
import { candidates } from "@/lib/data/candidates";
import { states, evByClass } from "@/lib/data/states";

export default function StrategyPage() {
  const battlegrounds = states.filter((s) => s.classification === "battleground");
  const leans = states.filter((s) => s.classification === "lean-r");
  const projectedEV = evByClass["safe-r"] + evByClass["lean-r"] + evByClass.battleground;
  const pct = Math.min(projectedEV / 270, 1);
  const C = 2 * Math.PI * 130;

  return (
    <div>
      <ChapterIntro
        index="02"
        kicker={`Slogan · “${candidates.slogan}”`}
        title="How we get to 270."
        lede="Hold the modern Republican coalition. Recover the suburbs we lost on tone, not on policy. Win Pennsylvania, and the math takes care of itself."
      />

      {/* 270 GAUGE */}
      <section className="container-page py-12">
        <SectionReveal>
          <TiltCard intensity={3} className="glass-strong p-8 md:p-12 grid md:grid-cols-[280px_1fr] gap-10 items-center">
            <div className="relative w-[260px] h-[260px] mx-auto md:mx-0">
              <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
                <circle cx="140" cy="140" r="130" fill="none" stroke="var(--hairline)" strokeWidth="4" />
                <motion.circle
                  cx="140"
                  cy="140"
                  r="130"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  whileInView={{ strokeDashoffset: C * (1 - pct) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: "drop-shadow(0 0 12px var(--accent-glow))" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Counter to={projectedEV} duration={1.6} delay={0.4} className="font-display text-7xl md:text-[88px] text-[var(--accent)] tabular-nums leading-none text-glow" />
                <div className="mt-2 text-xs tracking-[0.3em] uppercase text-[var(--ink-muted)]">of 270 to win</div>
              </div>
            </div>
            <div>
              <div className="smallcaps">Coalition Math</div>
              <SplitText as="h2" splitBy="word" stagger={0.04} className="font-display mt-3 text-3xl md:text-5xl tracking-[-0.02em] font-medium leading-[1]">
                The path is narrow but real.
              </SplitText>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Safe R", evByClass["safe-r"]],
                  ["Lean R", evByClass["lean-r"]],
                  ["Battleground", evByClass.battleground],
                  ["Concede", evByClass["safe-d"]],
                ].map(([label, ev], i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="glass p-4"
                  >
                    <div className="smallcaps">{label}</div>
                    <div className="font-display mt-1 text-3xl tabular-nums">
                      <Counter to={Number(ev)} duration={1.2} delay={0.5 + i * 0.08} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TiltCard>
        </SectionReveal>
      </section>

      {/* MAP */}
      <section className="container-page py-12">
        <SectionReveal>
          <ElectoralMapWrapper />
        </SectionReveal>
      </section>

      {/* BATTLEGROUNDS */}
      <section className="container-page py-24">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-12">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">A</span>
            <span className="smallcaps">Battlegrounds</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText as="h2" splitBy="word" stagger={0.04} className="font-display text-4xl md:text-6xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[20ch]">
            The four states we must win.
          </SplitText>
        </SectionReveal>

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {battlegrounds.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.05}>
              <TiltCard intensity={5} className="glass p-8 h-full">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="smallcaps">Must-win</div>
                    <div className="font-display mt-3 text-4xl md:text-5xl tracking-[-0.02em] font-medium leading-none">{s.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[64px] text-[var(--accent)] tabular-nums leading-none">
                      <Counter to={s.ev} duration={1.4} delay={i * 0.1} />
                    </div>
                    <div className="text-xs tracking-[0.25em] uppercase text-[var(--ink-muted)] mt-1">EV</div>
                  </div>
                </div>
                <div className="mt-6 text-[15px] text-[var(--ink-muted)] leading-[1.7]">{s.reasoning}</div>
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* LEANS */}
      <section className="container-page py-24">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-12">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">B</span>
            <span className="smallcaps">Lean states to lock</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
        </SectionReveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {leans.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.05}>
              <TiltCard intensity={4} className="glass p-7 h-full">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-2xl tracking-tight font-medium">{s.name}</div>
                  <div className="font-mono text-[var(--accent)] tabular-nums text-sm">
                    <Counter to={s.ev} duration={1.2} /> EV
                  </div>
                </div>
                <div className="mt-4 text-sm text-[var(--ink-muted)] leading-[1.7]">{s.reasoning}</div>
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
