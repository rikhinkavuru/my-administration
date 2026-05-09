import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import { outlets, interestGroups } from "@/lib/data/media";

export const metadata = { title: "Media & Coalition — Sackett / Kavuru 2028" };

export default function MediaPage() {
  return (
    <div>
      <Hero
        eyebrow="Media & Coalition"
        title="Where we make the case."
        subtitle="Three media outlets, in three different formats, and three interest groups whose alignment and electoral value make them load-bearing partners for the campaign."
      />

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionReveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Media Outlets</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">Three formats, three audiences.</h2>
        </SectionReveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {outlets.map((o, i) => (
            <SectionReveal key={o.name} delay={i * 0.08}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-7 h-full">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">{o.format}</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">{o.name}</div>
                <p className="mt-5 text-sm text-[var(--fg-muted)] leading-relaxed">{o.rationale}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-elev)]/30">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <SectionReveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Coalition</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">The three groups we organize first.</h2>
          </SectionReveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {interestGroups.map((g, i) => (
              <SectionReveal key={g.name} delay={i * 0.08}>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-7 h-full">
                  <div className="text-2xl font-semibold tracking-tight">{g.name}</div>
                  <div className="mt-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">Alignment</div>
                    <p className="mt-1 text-sm text-[var(--fg-muted)] leading-relaxed">{g.alignment}</p>
                  </div>
                  <div className="mt-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">Electoral Value</div>
                    <p className="mt-1 text-sm text-[var(--fg-muted)] leading-relaxed">{g.electoralValue}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
