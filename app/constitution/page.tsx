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

      <section className="container-page py-20 md:py-28">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">Proposed Amendments</div>
            <h2 className="font-display md:col-span-9 text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[22ch]">Two amendments. Both overdue.</h2>
          </div>
        </SectionReveal>

        <div className="mt-14 border-t border-[var(--hairline)]">
          {amendments.map((a, i) => (
            <SectionReveal key={a.title} delay={i * 0.06}>
              <article className="py-12 md:py-16 grid gap-x-12 gap-y-6 md:grid-cols-12 border-b border-[var(--hairline)]">
                <div className="md:col-span-3">
                  <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums">Amendment 0{i + 1}</div>
                  <div className="smallcaps mt-3">Why</div>
                  <p className="mt-2 text-sm text-[var(--ink-muted)] leading-relaxed">{a.rationale}</p>
                </div>
                <div className="md:col-span-9">
                  <h3 className="font-display text-3xl md:text-4xl tracking-tight font-medium leading-tight">{a.title}</h3>
                  <p className="mt-6 font-display text-xl md:text-2xl text-[var(--ink)] leading-[1.45] max-w-3xl italic">
                    “{a.text}”
                  </p>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--hairline)]">
        <div className="container-page py-20 md:py-28">
          <SectionReveal>
            <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
              <div className="smallcaps md:col-span-3">Civil Liberties</div>
              <h2 className="font-display md:col-span-9 text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[24ch]">Three rights. No retreat.</h2>
            </div>
          </SectionReveal>
          <div className="mt-14 grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] md:grid-cols-3">
            {liberties.map((l, i) => (
              <SectionReveal key={l.title} delay={i * 0.06}>
                <div className="bg-[var(--bg)] p-8 md:p-10 h-full">
                  <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums">0{i + 1}</div>
                  <div className="font-display mt-4 text-2xl tracking-tight font-medium leading-tight">{l.title}</div>
                  <p className="mt-5 text-[15px] text-[var(--ink-muted)] leading-relaxed">{l.body}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
