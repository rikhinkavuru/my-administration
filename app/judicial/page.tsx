import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import { judicial } from "@/lib/data/judicial";

export const metadata = { title: "Judicial — Sackett / Kavuru 2028" };

export default function JudicialPage() {
  return (
    <div>
      <ChapterIntro
        index="05"
        kicker="Judicial Branch"
        title="Judges who read the"
        italicAccent="text."
        lede="An originalist and textualist Supreme Court nominee, a clear judicial philosophy, and three honest litmus tests."
      />

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="card p-10 md:p-14">
            <div className="eyebrow">Ideal SCOTUS Nominee</div>
            <SplitText
              as="h2"
              stagger={0.025}
              className="font-display block mt-8 text-[56px] sm:text-[88px] md:text-[120px] lg:text-[144px] leading-[0.96]"
            >
              {judicial.nominee.name}
            </SplitText>
            <div className="mt-6 text-[var(--fg-60)] font-mono text-[12px] uppercase tracking-[0.08em]">
              {judicial.nominee.court}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-6 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
            {judicial.nominee.bio.map((b, i) => (
              <div key={i} className="bg-[var(--bg)] p-7 md:p-8 h-full">
                <div className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
                  0{i + 1} / 0{judicial.nominee.bio.length}
                </div>
                <div className="mt-5 text-[14px] md:text-[15px] text-[var(--fg)] leading-[1.7]">
                  {b}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      <section className="container-page py-20 grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] lg:grid-cols-2">
        <SectionReveal>
          <div className="bg-[var(--bg)] p-10 h-full">
            <div className="eyebrow">Judicial philosophy</div>
            <div className="font-display mt-6 text-[36px] md:text-[44px] leading-[1]">
              {judicial.philosophy.title}
            </div>
            <ul className="mt-8 space-y-5 text-[14px] md:text-[15px] text-[var(--fg-60)] leading-[1.7]">
              {judicial.philosophy.points.map((p, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2">
                  <span className="text-[var(--fg-40)] font-mono text-[10px] tabular-nums pt-[2px]">
                    0{i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="bg-[var(--bg)] p-10 h-full">
            <div className="eyebrow">Litmus tests</div>
            <div className="font-display mt-6 text-[36px] md:text-[44px] leading-[1] max-w-[20ch]">
              Three. No more,{" "}
              <span className="font-serif-italic text-[var(--accent-red)]">no less.</span>
            </div>
            <ol className="mt-8 space-y-5 text-[14px] md:text-[15px] text-[var(--fg-60)] leading-[1.7]">
              {judicial.litmusTests.map((t, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2">
                  <span className="text-[var(--fg-40)] font-mono text-[10px] tabular-nums pt-[2px]">
                    0{i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
