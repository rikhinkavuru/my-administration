import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import BudgetCharts from "@/components/BudgetCharts";
import { budgetCommentary } from "@/lib/data/budget";

export const metadata = { title: "Budget — Sackett / Kavuru 2028" };

export default function BudgetPage() {
  return (
    <div>
      <ChapterIntro
        index="07"
        kicker="Federal Budget"
        title="Honest math."
        italicAccent="Honest priorities."
        lede="The current federal budget, the Sackett / Kavuru proposed budget, and a plain explanation of what changes and why."
      />

      <section className="container-page py-12">
        <SectionReveal>
          <BudgetCharts />
        </SectionReveal>
      </section>

      <section className="container-page py-16 pb-24">
        <SectionReveal>
          <div className="card p-10 md:p-14">
            <div className="eyebrow">Commentary</div>
            <p className="mt-8 text-[20px] md:text-[28px] tracking-[-0.005em] leading-[1.55] text-[var(--fg)] max-w-[58ch]">
              {budgetCommentary}
            </p>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
