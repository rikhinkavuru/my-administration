import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import TiltCard from "@/components/TiltCard";
import { outlets, interestGroups } from "@/lib/data/media";

export const metadata = { title: "Media & Coalition — Sackett / Kavuru 2028" };

export default function MediaPage() {
  return (
    <div>
      <ChapterIntro
        index="08"
        kicker="Media & Coalition"
        title="Where we make the case."
        lede="Three media outlets in three different formats, and three interest groups whose alignment and electoral value make them load-bearing partners."
      />

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-12">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">A</span>
            <span className="smallcaps">Media Outlets</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText as="h2" splitBy="word" stagger={0.05} className="font-display text-4xl md:text-6xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[20ch]">
            Three formats. Three audiences.
          </SplitText>
        </SectionReveal>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {outlets.map((o, i) => (
            <SectionReveal key={o.name} delay={i * 0.06}>
              <TiltCard intensity={5} className="glass p-8 h-full">
                <div className="smallcaps">{o.format}</div>
                <div className="font-display mt-5 text-2xl md:text-[28px] tracking-[-0.02em] font-medium leading-tight">{o.name}</div>
                <p className="mt-5 text-[14px] text-[var(--ink-muted)] leading-[1.7]">{o.rationale}</p>
                <div className="mt-8 font-mono text-[10px] tabular-nums text-[var(--ink-faint)]">OUTLET 0{i + 1}/03</div>
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16 md:py-20 pb-28">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-12">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">B</span>
            <span className="smallcaps">Coalition</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText as="h2" splitBy="word" stagger={0.05} className="font-display text-4xl md:text-6xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[22ch]">
            The three groups we organize first.
          </SplitText>
        </SectionReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {interestGroups.map((g, i) => (
            <SectionReveal key={g.name} delay={i * 0.06}>
              <TiltCard intensity={5} className="glass p-8 h-full">
                <div className="font-mono text-xs text-[var(--accent)] tabular-nums tracking-[0.2em]">0{i + 1}</div>
                <div className="font-display mt-4 text-2xl md:text-[28px] tracking-[-0.02em] font-medium leading-tight">{g.name}</div>
                <div className="mt-6 pt-6 border-t border-[var(--hairline)]">
                  <div className="smallcaps">Alignment</div>
                  <p className="mt-3 text-[14px] text-[var(--ink-muted)] leading-[1.7]">{g.alignment}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--hairline)]">
                  <div className="smallcaps">Electoral Value</div>
                  <p className="mt-3 text-[14px] text-[var(--ink-muted)] leading-[1.7]">{g.electoralValue}</p>
                </div>
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
