import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import CabinetCard from "@/components/CabinetCard";
import { cabinet } from "@/lib/data/cabinet";
import { bureaucraticVision } from "@/lib/data/executive";

export const metadata = { title: "Executive — Sackett / Kavuru 2028" };

export default function ExecutivePage() {
  return (
    <div>
      <ChapterIntro
        index="04"
        kicker="Executive Branch"
        title="A government that"
        italicAccent="serves."
        lede="A bureaucratic vision and fifteen confirmable cabinet nominees — each chosen for substance and the realistic prospect of Senate confirmation."
      />

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="card p-10 md:p-14">
            <div className="eyebrow">Bureaucratic Vision</div>
            <p className="mt-8 text-[24px] md:text-[34px] tracking-[-0.015em] leading-[1.4] text-[var(--fg)] max-w-[44ch]">
              {bureaucraticVision}
            </p>
          </div>
        </SectionReveal>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)]">[ 15 ]</span>
            <span className="eyebrow">The Cabinet</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[20ch]"
          >
            Fifteen confirmable nominees.
          </SplitText>
        </SectionReveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          {cabinet.map((c, i) => (
            <CabinetCard key={c.department} pick={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
