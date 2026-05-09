"use client";
import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import ElectoralMapWrapper from "@/components/ElectoralMapWrapper";
import Counter from "@/components/Counter";
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
        kicker={`Strategy — “${candidates.slogan}”`}
        title="How we get to"
        italicAccent="270."
        lede="Hold the modern Republican coalition. Recover the suburbs we lost on tone, not on policy. Win Pennsylvania, and the math takes care of itself."
      />

      {/* 270 GAUGE */}
      <section className="container-page py-12">
        <SectionReveal>
          <div className="card p-10 md:p-14 grid md:grid-cols-[300px_1fr] gap-12 items-center">
            <div className="relative w-[280px] h-[280px] mx-auto md:mx-0">
              <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
                <circle cx="140" cy="140" r="130" fill="none" stroke="var(--hairline)" strokeWidth="2" />
                <motion.circle
                  cx="140"
                  cy="140"
                  r="130"
                  fill="none"
                  stroke="var(--accent-red)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  whileInView={{ strokeDashoffset: C * (1 - pct) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Counter
                  to={projectedEV}
                  duration={1.6}
                  delay={0.4}
                  className="font-display text-[88px] md:text-[104px] tabular-nums leading-none"
                />
                <div className="mt-3 font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--fg-60)]">
                  Projected EV
                </div>
              </div>
            </div>
            <div>
              <div className="eyebrow">Coalition math</div>
              <SplitText
                as="h2"
                splitBy="word"
                stagger={0.04}
                className="font-display mt-4 text-[40px] md:text-[60px] leading-[0.98]"
              >
                The path is narrow but real.
              </SplitText>
              <div className="mt-10 grid grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
                {[
                  ["Safe R", evByClass["safe-r"]],
                  ["Lean R", evByClass["lean-r"]],
                  ["Battleground", evByClass.battleground],
                  ["Concede", evByClass["safe-d"]],
                ].map(([label, ev], i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[var(--bg)] p-5"
                  >
                    <div className="eyebrow !text-[var(--fg-40)]">{label}</div>
                    <div className="font-display mt-2 text-[32px] tabular-nums">
                      <Counter to={Number(ev)} duration={1.2} delay={0.5 + i * 0.06} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
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
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">[ A ]</span>
            <span className="eyebrow">Battlegrounds</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[20ch]"
          >
            The four states we must win.
          </SplitText>
        </SectionReveal>

        <div className="mt-12 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          {battlegrounds.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.04}>
              <div className="bg-[var(--bg)] p-8 md:p-10 h-full">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="eyebrow !text-[var(--fg-40)]">Must-win</div>
                    <div className="font-display mt-4 text-[44px] md:text-[56px] leading-[0.96]">
                      {s.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[64px] tabular-nums leading-none">
                      <Counter to={s.ev} duration={1.4} delay={i * 0.1} />
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--fg-40)]">
                      EV
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-[14px] md:text-[15px] text-[var(--fg-60)] leading-[1.7]">
                  {s.reasoning}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* LEANS */}
      <section className="container-page py-24">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">[ B ]</span>
            <span className="eyebrow">Lean states to lock</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
        </SectionReveal>
        <div className="mt-8 grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] md:grid-cols-3">
          {leans.map((s) => (
            <div key={s.id} className="bg-[var(--bg)] p-7">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-[28px]">{s.name}</div>
                <div className="font-mono text-[12px] tabular-nums text-[var(--fg-60)]">
                  {s.ev} EV
                </div>
              </div>
              <div className="mt-4 text-[13px] text-[var(--fg-60)] leading-[1.7]">{s.reasoning}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
