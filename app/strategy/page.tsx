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
        eyebrow={`Slogan: “${candidates.slogan}”`}
        title="How we get to 270."
        subtitle="Hold the modern Republican coalition. Bring back the suburbs we lost on tone, not on policy. Win Pennsylvania, and the math takes care of itself."
      />

      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <SectionReveal>
          <ElectoralMapWrapper />
        </SectionReveal>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <SectionReveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Battleground Analysis</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">The four states we must win.</h2>
          <p className="mt-5 max-w-3xl text-[var(--fg-muted)] leading-relaxed">
            Safe (209) plus Lean (43) puts the ticket at 252. Eighteen more electoral votes get us to 270. Pennsylvania alone clinches it.
            The backup path is Wisconsin plus Nevada (16 EV) combined with any other battleground.
          </p>
        </SectionReveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {battlegrounds.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.05}>
              <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-elev)] p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-2xl font-semibold tracking-tight">{s.name}</div>
                  <div className="font-mono text-[var(--accent)] text-xl tabular-nums">{s.ev} EV</div>
                </div>
                <div className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed">{s.reasoning}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <SectionReveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Lean States to Lock</div>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">High-confidence wins on the path.</h2>
        </SectionReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {leans.map((s) => (
            <div key={s.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5">
              <div className="flex items-baseline justify-between">
                <div className="text-xl font-semibold">{s.name}</div>
                <div className="font-mono text-[var(--accent)] tabular-nums">{s.ev} EV</div>
              </div>
              <div className="mt-2 text-sm text-[var(--fg-muted)]">{s.reasoning}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
