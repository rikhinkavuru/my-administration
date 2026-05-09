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
        subtitle="Three media outlets in three different formats, and three interest groups whose alignment and electoral value make them load-bearing partners."
      />

      <section className="container-page py-20 md:py-24">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">Media Outlets</div>
            <h2 className="font-display md:col-span-9 text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[22ch]">Three formats. Three audiences.</h2>
          </div>
        </SectionReveal>
        <div className="mt-14 border-t border-[var(--hairline)]">
          {outlets.map((o, i) => (
            <SectionReveal key={o.name} delay={i * 0.05}>
              <div className="py-10 grid gap-x-12 gap-y-3 md:grid-cols-12 border-b border-[var(--hairline)]">
                <div className="md:col-span-3">
                  <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums">0{i + 1}</div>
                  <div className="smallcaps mt-3">{o.format}</div>
                </div>
                <div className="md:col-span-9">
                  <div className="font-display text-2xl md:text-3xl tracking-tight font-medium leading-tight">{o.name}</div>
                  <p className="mt-4 text-[15px] text-[var(--ink-muted)] leading-[1.7] max-w-3xl">{o.rationale}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--hairline)]">
        <div className="container-page py-20 md:py-24">
          <SectionReveal>
            <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
              <div className="smallcaps md:col-span-3">Coalition</div>
              <h2 className="font-display md:col-span-9 text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[22ch]">The three groups we organize first.</h2>
            </div>
          </SectionReveal>
          <div className="mt-14 border-t border-[var(--hairline)]">
            {interestGroups.map((g, i) => (
              <SectionReveal key={g.name} delay={i * 0.05}>
                <div className="py-10 grid gap-x-12 gap-y-6 md:grid-cols-12 border-b border-[var(--hairline)]">
                  <div className="md:col-span-4">
                    <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums">0{i + 1}</div>
                    <div className="font-display mt-3 text-2xl md:text-3xl tracking-tight font-medium leading-tight">{g.name}</div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="smallcaps">Alignment</div>
                    <p className="mt-3 text-[15px] text-[var(--ink-muted)] leading-[1.7]">{g.alignment}</p>
                  </div>
                  <div className="md:col-span-4">
                    <div className="smallcaps">Electoral Value</div>
                    <p className="mt-3 text-[15px] text-[var(--ink-muted)] leading-[1.7]">{g.electoralValue}</p>
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
