import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import TiltCard from "@/components/TiltCard";
import { amendments, liberties } from "@/lib/data/constitution";

export const metadata = { title: "Constitution — Sackett / Kavuru 2028" };

export default function ConstitutionPage() {
  return (
    <div>
      <ChapterIntro
        index="03"
        kicker="Proposed Amendments & Civil Liberties"
        title="Restore the constitutional order."
        lede="Two amendments to send to the states. Three civil liberties this administration will defend without apology."
      />

      <section className="container-page py-20 md:py-24">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-12">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">A</span>
            <span className="smallcaps">Proposed Amendments</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText as="h2" splitBy="word" stagger={0.05} className="font-display text-4xl md:text-6xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[20ch]">
            Two amendments. Both overdue.
          </SplitText>
        </SectionReveal>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {amendments.map((a, i) => (
            <SectionReveal key={a.title} delay={i * 0.08}>
              <TiltCard intensity={5} className="glass-strong p-8 md:p-10 h-full">
                <div className="font-mono text-xs text-[var(--accent)] tabular-nums tracking-[0.2em]">AMENDMENT 0{i + 1}</div>
                <h3 className="font-display mt-5 text-3xl md:text-4xl tracking-[-0.02em] font-medium leading-tight">{a.title}</h3>
                <p className="mt-8 font-display text-xl md:text-2xl text-[var(--ink)] leading-[1.45] italic">
                  “{a.text}”
                </p>
                <div className="mt-8 pt-6 border-t border-[var(--hairline)]">
                  <div className="smallcaps">Why</div>
                  <p className="mt-3 text-[14px] text-[var(--ink-muted)] leading-[1.7]">{a.rationale}</p>
                </div>
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="container-page py-24">
        <SectionReveal>
          <div className="flex items-center gap-6 mb-12">
            <span className="font-mono text-xs tabular-nums tracking-[0.25em] text-[var(--accent)]">B</span>
            <span className="smallcaps">Civil Liberties</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText as="h2" splitBy="word" stagger={0.05} className="font-display text-4xl md:text-6xl tracking-[-0.025em] font-medium leading-[0.95] max-w-[18ch]">
            Three rights. No retreat.
          </SplitText>
        </SectionReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {liberties.map((l, i) => (
            <SectionReveal key={l.title} delay={i * 0.08}>
              <TiltCard intensity={5} className="glass p-8 h-full">
                <div className="font-mono text-xs text-[var(--accent)] tabular-nums tracking-[0.2em]">0{i + 1}</div>
                <div className="font-display mt-5 text-2xl md:text-3xl tracking-[-0.02em] font-medium leading-tight">{l.title}</div>
                <p className="mt-5 text-[15px] text-[var(--ink-muted)] leading-[1.7]">{l.body}</p>
              </TiltCard>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
