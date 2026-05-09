import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import { outlets, interestGroups } from "@/lib/data/media";

export const metadata = { title: "Media & Coalition — Sackett / Kavuru 2028" };

export default function MediaPage() {
  return (
    <div>
      <ChapterIntro
        index="08"
        kicker="Media & Coalition"
        title="Where we make the"
        italicAccent="case."
        lede="Three media outlets in three different formats, and three interest groups whose alignment and electoral value make them load-bearing partners."
      />

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ A ]</span>
            <span className="eyebrow">Media Outlets</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[20ch]"
          >
            Three formats. Three audiences.
          </SplitText>
        </SectionReveal>

        <div className="mt-12 grid md:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          {outlets.map((o, i) => (
            <SectionReveal key={o.name} delay={i * 0.05}>
              <div className="bg-[var(--bg)] p-7 md:p-8 h-full flex flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
                    OUTLET 0{i + 1} / 03
                  </span>
                  <span className="eyebrow !text-[var(--fg-40)]">{o.format}</span>
                </div>
                <div className="font-display mt-8 text-[26px] md:text-[28px] leading-[1.05]">
                  {o.name}
                </div>
                <p className="mt-5 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                  {o.rationale}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16 md:py-20 pb-24">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ B ]</span>
            <span className="eyebrow">Coalition</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[22ch]"
          >
            The three groups we organize first.
          </SplitText>
        </SectionReveal>

        <div className="mt-12 grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] md:grid-cols-3">
          {interestGroups.map((g, i) => (
            <SectionReveal key={g.name} delay={i * 0.05}>
              <div className="bg-[var(--bg)] p-7 md:p-8 h-full">
                <div className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
                  0{i + 1} / 03
                </div>
                <div className="font-display mt-6 text-[26px] md:text-[28px] leading-[1.05]">
                  {g.name}
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--hairline)]">
                  <div className="eyebrow !text-[var(--fg-40)]">Alignment</div>
                  <p className="mt-3 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                    {g.alignment}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--hairline)]">
                  <div className="eyebrow !text-[var(--fg-40)]">Electoral Value</div>
                  <p className="mt-3 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                    {g.electoralValue}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
