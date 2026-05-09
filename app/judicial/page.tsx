import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import { judicial } from "@/lib/data/judicial";

export const metadata = { title: "Judicial — Sackett / Kavuru 2028" };

export default function JudicialPage() {
  return (
    <div>
      <Hero
        eyebrow="Judicial Branch"
        title="Judges who read the text."
        subtitle="An originalist and textualist Supreme Court nominee, a clear judicial philosophy, and three honest litmus tests."
      />

      <section className="max-w-[1200px] mx-auto px-6 py-20 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <SectionReveal>
          <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--bg-elev)] p-8 md:p-10 h-full">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Ideal SCOTUS Nominee</div>
            <div className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">{judicial.nominee.name}</div>
            <div className="mt-2 text-[var(--fg-muted)]">{judicial.nominee.court}</div>
            <ul className="mt-8 space-y-4">
              {judicial.nominee.bio.map((b, i) => (
                <li key={i} className="flex gap-3 text-[var(--fg-muted)] leading-relaxed">
                  <span className="font-mono text-[var(--accent)] shrink-0">0{i + 1}</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>

        <div className="flex flex-col gap-6">
          <SectionReveal delay={0.1}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 h-full">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Judicial Philosophy</div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{judicial.philosophy.title}</div>
              <ul className="mt-5 space-y-3 text-sm text-[var(--fg-muted)] leading-relaxed">
                {judicial.philosophy.points.map((p, i) => (
                  <li key={i} className="flex gap-2"><span className="text-[var(--accent)]">•</span>{p}</li>
                ))}
              </ul>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.18}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Litmus Tests</div>
              <ol className="mt-5 space-y-4 text-sm text-[var(--fg-muted)] leading-relaxed">
                {judicial.litmusTests.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-[var(--accent)]">0{i + 1}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
