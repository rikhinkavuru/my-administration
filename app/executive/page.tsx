import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import CabinetCard from "@/components/CabinetCard";
import TiltCard from "@/components/TiltCard";
import { cabinet } from "@/lib/data/cabinet";
import { bureaucraticVision } from "@/lib/data/executive";

export const metadata = { title: "Executive — Sackett / Kavuru 2028" };

export default function ExecutivePage() {
  return (
    <div>
      <ChapterIntro
        index="04"
        kicker="Executive Branch"
        title="A government that serves."
        lede="A bureaucratic vision and fifteen confirmable cabinet nominees — each chosen for substance and the realistic prospect of Senate confirmation."
      />

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <TiltCard intensity={3} className="glass-strong p-8 md:p-14">
            <div className="smallcaps">Bureaucratic Vision</div>
            <p className="font-display mt-6 text-2xl md:text-4xl tracking-[-0.015em] leading-[1.45] text-[var(--ink)] max-w-[44ch]">
              {bureaucraticVision}
            </p>
          </TiltCard>
        </SectionReveal>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-12">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">15</span>
            <span className="smallcaps">The Cabinet</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText as="h2" splitBy="word" stagger={0.05} className="font-display text-4xl md:text-6xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[20ch]">
            Fifteen confirmable nominees.
          </SplitText>
        </SectionReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cabinet.map((c, i) => (
            <CabinetCard key={c.department} pick={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
