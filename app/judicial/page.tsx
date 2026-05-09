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

      <section className="container-page py-20 md:py-24">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">Ideal SCOTUS Nominee</div>
            <div className="md:col-span-9">
              <div className="font-display text-5xl md:text-7xl tracking-[-0.02em] font-medium leading-[0.95]">{judicial.nominee.name}</div>
              <div className="mt-4 text-[var(--ink-muted)]">{judicial.nominee.court}</div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <div className="mt-14 border-t border-[var(--hairline)]">
            {judicial.nominee.bio.map((b, i) => (
              <div key={i} className="py-7 grid grid-cols-[3rem_1fr] gap-6 items-baseline border-b border-[var(--hairline)]">
                <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums">0{i + 1}</div>
                <div className="text-[15px] md:text-base text-[var(--ink)] leading-[1.7] max-w-3xl">{b}</div>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      <section className="border-t border-[var(--hairline)]">
        <div className="container-page py-20 md:py-24 grid gap-12 md:gap-20 lg:grid-cols-2">
          <SectionReveal>
            <div className="smallcaps">Judicial philosophy</div>
            <div className="font-display mt-3 text-3xl md:text-4xl tracking-tight font-medium leading-tight">{judicial.philosophy.title}</div>
            <ul className="mt-8 space-y-5 text-[15px] text-[var(--ink-muted)] leading-[1.7]">
              {judicial.philosophy.points.map((p, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="text-[var(--accent)] font-mono text-xs tabular-nums pt-[2px]">0{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="smallcaps">Litmus tests</div>
            <div className="font-display mt-3 text-3xl md:text-4xl tracking-tight font-medium leading-tight max-w-[20ch]">Three. No more, no less.</div>
            <ol className="mt-8 space-y-5 text-[15px] text-[var(--ink-muted)] leading-[1.7]">
              {judicial.litmusTests.map((t, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="text-[var(--accent)] font-mono text-xs tabular-nums pt-[2px]">0{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
