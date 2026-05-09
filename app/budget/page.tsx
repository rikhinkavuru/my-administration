import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import TiltCard from "@/components/TiltCard";
import BudgetCharts from "@/components/BudgetCharts";
import { budgetCommentary } from "@/lib/data/budget";

export const metadata = { title: "Budget — Sackett / Kavuru 2028" };

export default function BudgetPage() {
  return (
    <div>
      <ChapterIntro
        index="07"
        kicker="Federal Budget"
        title="Honest math. Honest priorities."
        lede="The current federal budget, the Sackett / Kavuru proposed budget, and a plain explanation of what changes and why."
      />

      <section className="container-page py-12">
        <SectionReveal>
          <BudgetCharts />
        </SectionReveal>
      </section>

      <section className="container-page py-16 pb-28">
        <SectionReveal>
          <TiltCard intensity={3} className="glass-strong p-8 md:p-14">
            <div className="smallcaps">Commentary</div>
            <p className="font-display mt-6 text-xl md:text-3xl tracking-[-0.01em] leading-[1.55] text-[var(--ink)] max-w-[58ch]">
              {budgetCommentary}
            </p>
          </TiltCard>
        </SectionReveal>
      </section>
    </div>
  );
}
