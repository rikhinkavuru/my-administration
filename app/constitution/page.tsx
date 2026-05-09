import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import { amendments, liberties } from "@/lib/data/constitution";

export const metadata = { title: "Constitution — Sackett / Kavuru 2028" };

export default function ConstitutionPage() {
  return (
    <div>
      <Hero
        eyebrow="Proposed Amendments & Civil Liberties"
        title="Restore the constitutional order."
        subtitle="Two amendments to send to the states, and three civil liberties this administration will defend without apology."
      />

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionReveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Proposed Amendments</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">Two amendments. Both overdue.</h2>
        </SectionReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {amendments.map((a, i) => (
            <SectionReveal key={a.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 h-full">
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">Amendment {i + 1}</div>
                <div className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">{a.title}</div>
                <p className="mt-5 text-[var(--fg)] leading-relaxed">{a.text}</p>
                <p className="mt-4 text-sm text-[var(--fg-muted)] leading-relaxed"><span className="text-[var(--accent)] font-mono uppercase tracking-wider text-[10px] mr-2">Why</span>{a.rationale}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-elev)]/30">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <SectionReveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Most-Cherished Civil Liberties</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">Three rights. No retreat.</h2>
          </SectionReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {liberties.map((l, i) => (
              <SectionReveal key={l.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-7 h-full">
                  <div className="text-xl font-semibold tracking-tight">{l.title}</div>
                  <p className="mt-4 text-sm text-[var(--fg-muted)] leading-relaxed">{l.body}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
