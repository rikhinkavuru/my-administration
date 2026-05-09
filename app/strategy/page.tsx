import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import ElectoralMapWrapper from "@/components/ElectoralMapWrapper";
import { candidates } from "@/lib/data/candidates";
import { states } from "@/lib/data/states";

export const metadata = { title: "Strategy — Sackett / Kavuru 2028" };

export default function StrategyPage() {
  const battlegrounds = states.filter((s) => s.classification === "battleground");
  const leans = states.filter((s) => s.classification === "lean-r");

  return (
    <div>
      <Hero
        eyebrow={`Slogan — “${candidates.slogan}”`}
        title="How we get to 270."
        subtitle="Hold the modern Republican coalition. Recover the suburbs we lost on tone, not on policy. Win Pennsylvania, and the math takes care of itself."
      />

      <section className="container-page py-16">
        <SectionReveal>
          <ElectoralMapWrapper />
        </SectionReveal>
      </section>

      <section className="container-page py-16">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">Battlegrounds</div>
            <div className="md:col-span-9">
              <h2 className="font-display text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[22ch]">The four states we must win.</h2>
              <p className="mt-6 max-w-2xl text-[var(--ink-muted)] leading-[1.7]">
                Safe (209) plus Lean (43) puts the ticket at 252. Eighteen
                more electoral votes get us to 270. Pennsylvania alone
                clinches it. The backup path is Wisconsin plus Nevada (16 EV)
                combined with any other battleground.
              </p>
            </div>
          </div>
        </SectionReveal>

        <div className="mt-12 border-t border-[var(--hairline)]">
          {battlegrounds.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.04}>
              <div className="py-8 grid grid-cols-[3rem_1fr_auto] md:grid-cols-[3rem_1fr_2fr_auto] gap-6 items-baseline border-b border-[var(--hairline)]">
                <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums">0{i + 1}</div>
                <div className="font-display text-2xl md:text-3xl tracking-tight font-medium">{s.name}</div>
                <div className="text-[15px] text-[var(--ink-muted)] leading-relaxed col-span-3 md:col-span-1">{s.reasoning}</div>
                <div className="font-display text-2xl text-[var(--accent)] tabular-nums">{s.ev}<span className="text-sm text-[var(--ink-muted)] ml-1 font-sans">EV</span></div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">Lean states</div>
            <h2 className="font-display md:col-span-9 text-2xl md:text-3xl tracking-tight font-medium leading-tight max-w-[22ch]">High-confidence wins on the path.</h2>
          </div>
        </SectionReveal>
        <div className="mt-10 grid gap-px bg-[var(--hairline)] md:grid-cols-3 border border-[var(--hairline)]">
          {leans.map((s) => (
            <div key={s.id} className="bg-[var(--bg)] p-6">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-xl tracking-tight font-medium">{s.name}</div>
                <div className="font-mono text-[var(--accent)] tabular-nums text-sm">{s.ev} EV</div>
              </div>
              <div className="mt-3 text-sm text-[var(--ink-muted)] leading-relaxed">{s.reasoning}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
