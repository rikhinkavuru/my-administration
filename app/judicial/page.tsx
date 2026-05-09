import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import TiltCard from "@/components/TiltCard";
import { judicial } from "@/lib/data/judicial";

export const metadata = { title: "Judicial — Sackett / Kavuru 2028" };

export default function JudicialPage() {
  return (
    <div>
      <ChapterIntro
        index="05"
        kicker="Judicial Branch"
        title="Judges who read the text."
        lede="An originalist and textualist Supreme Court nominee, a clear judicial philosophy, and three honest litmus tests."
      />

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <TiltCard intensity={3} className="glass-strong p-8 md:p-14">
            <div className="smallcaps">Ideal SCOTUS Nominee</div>
            <SplitText as="h2" stagger={0.025} className="font-display block mt-6 text-5xl md:text-8xl tracking-[-0.025em] font-medium leading-[0.92] text-glow">
              {judicial.nominee.name}
            </SplitText>
            <div className="mt-5 text-[var(--ink-muted)]">{judicial.nominee.court}</div>
          </TiltCard>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {judicial.nominee.bio.map((b, i) => (
              <TiltCard key={i} intensity={4} className="glass p-7 h-full">
                <div className="font-mono text-xs text-[var(--accent)] tabular-nums tracking-[0.2em]">0{i + 1}</div>
                <div className="mt-4 text-[15px] md:text-base text-[var(--ink)] leading-[1.7]">{b}</div>
              </TiltCard>
            ))}
          </div>
        </SectionReveal>
      </section>

      <section className="container-page py-20 grid gap-8 lg:grid-cols-2">
        <SectionReveal>
          <TiltCard intensity={4} className="glass p-8 md:p-10 h-full">
            <div className="smallcaps">Judicial philosophy</div>
            <div className="font-display mt-4 text-3xl md:text-4xl tracking-[-0.02em] font-medium leading-tight">{judicial.philosophy.title}</div>
            <ul className="mt-8 space-y-5 text-[15px] text-[var(--ink-muted)] leading-[1.7]">
              {judicial.philosophy.points.map((p, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="text-[var(--accent)] font-mono text-xs tabular-nums pt-[2px]">0{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </TiltCard>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <TiltCard intensity={4} className="glass p-8 md:p-10 h-full">
            <div className="smallcaps">Litmus tests</div>
            <div className="font-display mt-4 text-3xl md:text-4xl tracking-[-0.02em] font-medium leading-tight max-w-[20ch]">Three. No more, no less.</div>
            <ol className="mt-8 space-y-5 text-[15px] text-[var(--ink-muted)] leading-[1.7]">
              {judicial.litmusTests.map((t, i) => (
                <li key={i} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="text-[var(--accent)] font-mono text-xs tabular-nums pt-[2px]">0{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </TiltCard>
        </SectionReveal>
      </section>
    </div>
  );
}
