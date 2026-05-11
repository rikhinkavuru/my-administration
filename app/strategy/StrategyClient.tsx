"use client";
import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import ElectoralMapWrapper from "@/components/ElectoralMapWrapper";
import Counter from "@/components/Counter";
import { motion } from "framer-motion";
import { candidates } from "@/lib/data/candidates";
import { states, evByClass } from "@/lib/data/states";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function StrategyClient() {
  const battlegrounds = states.filter((s) => s.classification === "battleground");
  const leans = states.filter((s) => s.classification === "lean-r");
  const safeR = evByClass["safe-r"];
  const leanR = evByClass["lean-r"];
  const battle = evByClass.battleground;
  const concede = evByClass["safe-d"];

  const projectedEV = safeR + leanR + battle;
  const lockedEV = safeR + leanR;
  const cushion = projectedEV - 270;

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
      <section aria-labelledby="gauge-heading" className="container-page py-12">
        <SectionReveal>
          <div className="card p-10 md:p-14 grid md:grid-cols-[300px_1fr] gap-12 items-center">
            <div className="relative w-[280px] h-[280px] mx-auto md:mx-0">
              <svg
                viewBox="0 0 280 280"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label={`Projected electoral votes ${projectedEV}, threshold 270, cushion ${cushion}.`}
              >
                {/* outer rail */}
                <circle
                  cx="140"
                  cy="140"
                  r="130"
                  fill="none"
                  stroke="var(--hairline)"
                  strokeWidth="2"
                />
                {/* inner dashed rail */}
                <circle
                  cx="140"
                  cy="140"
                  r="118"
                  fill="none"
                  stroke="var(--hairline-faint)"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                {/* 270 tick marker on the rail */}
                <motion.circle
                  cx="140"
                  cy="140"
                  r="130"
                  fill="none"
                  stroke="var(--fg-40)"
                  strokeWidth="2"
                  strokeDasharray={`2 ${C - 2}`}
                  strokeDashoffset={-C * (270 / 538) + 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                />
                {/* progress sweep */}
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
                  transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Counter
                  to={projectedEV}
                  duration={1.6}
                  delay={0.4}
                  className="font-display text-[88px] md:text-[104px] tabular-nums leading-none"
                />
                <div className="mt-2 font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--fg-60)]">
                  Projected EV
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="mt-3 px-2.5 py-1 border border-[var(--accent-red)] text-[var(--accent-red)] font-mono text-[10px] tabular-nums tracking-[0.08em] uppercase"
                >
                  +{cushion} over 270
                </motion.div>
              </div>
            </div>
            <div>
              <h2 id="gauge-heading" className="eyebrow">
                Coalition math
              </h2>
              <SplitText
                as="p"
                splitBy="word"
                stagger={0.04}
                className="font-display mt-4 text-[40px] md:text-[60px] leading-[0.98]"
              >
                The path is narrow but real.
              </SplitText>
              <p className="mt-6 max-w-[52ch] text-[14px] md:text-[15px] text-[var(--fg-60)] leading-[1.7]">
                With {lockedEV} EV locked from safe and lean Republican states
                alone, the campaign needs just {270 - lockedEV} more — any one
                of Pennsylvania, Michigan, or Wisconsin clears 270 outright,
                and all four battlegrounds together deliver a cushion of{" "}
                {cushion}.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
                {[
                  ["Safe R", safeR, "var(--fg)"],
                  ["Lean R", leanR, "var(--fg-60)"],
                  ["Battleground", battle, "var(--accent-red)"],
                  ["Concede", concede, "var(--fg-40)"],
                ].map(([label, ev, color], i) => (
                  <motion.div
                    key={String(label)}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.06, ease: EASE }}
                    className="bg-[var(--bg)] p-5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-3"
                        style={{ background: String(color) }}
                      />
                      <div className="eyebrow !text-[var(--fg-40)]">{label}</div>
                    </div>
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
      <section aria-labelledby="map-heading" className="container-page py-12">
        <SectionReveal>
          <div className="flex items-end justify-between mb-8 gap-6 flex-wrap">
            <div>
              <div className="eyebrow">The map</div>
              <h2
                id="map-heading"
                className="font-display mt-3 text-[36px] md:text-[56px] leading-[0.98] max-w-[18ch]"
              >
                Fifty states. Four that decide.
              </h2>
            </div>
            <p className="max-w-[42ch] text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
              Hover any state to see its electoral votes and classification.
              Safe states stay white. Battlegrounds carry the campaign&apos;s only red.
            </p>
          </div>
          <ElectoralMapWrapper />
        </SectionReveal>
      </section>

      {/* BATTLEGROUNDS */}
      <section aria-labelledby="battlegrounds-heading" className="container-page py-24">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ A ]</span>
            <span className="eyebrow" id="battlegrounds-heading">Battlegrounds</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
              {battle} EV combined
            </span>
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

        <ol className="mt-12 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)] list-none">
          {battlegrounds.map((s, i) => (
            <li key={s.id}>
              <SectionReveal delay={i * 0.04}>
                <article className="bg-[var(--bg)] p-8 md:p-10 h-full">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <div className="eyebrow !text-[var(--accent-red)]">Must-win</div>
                      <h3 className="font-display mt-4 text-[44px] md:text-[56px] leading-[0.96]">
                        {s.name}
                      </h3>
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
                  <p className="mt-6 text-[14px] md:text-[15px] text-[var(--fg-60)] leading-[1.7]">
                    {s.reasoning}
                  </p>
                </article>
              </SectionReveal>
            </li>
          ))}
        </ol>
      </section>

      {/* LEANS */}
      <section aria-labelledby="leans-heading" className="container-page py-24">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ B ]</span>
            <span className="eyebrow" id="leans-heading">Lean states to lock</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
              {leanR} EV combined
            </span>
          </div>
        </SectionReveal>
        <div className="mt-8 grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] md:grid-cols-3">
          {leans.map((s) => (
            <article key={s.id} className="bg-[var(--bg)] p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[28px]">{s.name}</h3>
                <div className="font-mono text-[12px] tabular-nums text-[var(--fg-60)]">
                  {s.ev} EV
                </div>
              </div>
              <p className="mt-4 text-[13px] text-[var(--fg-60)] leading-[1.7]">
                {s.reasoning}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
