import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import BudgetCharts from "@/components/BudgetCharts";
import { budgetCommentary } from "@/lib/data/budget";

export const metadata = { title: "Budget — Sackett / Kavuru 2028" };

export default function BudgetPage() {
  return (
    <div>
      <Hero
        eyebrow="Federal Budget"
        title="Honest math. Honest priorities."
        subtitle="The current federal budget, the Sackett / Kavuru proposed budget, and a plain explanation of what changes and why."
      />

      <section className="container-page py-16">
        <SectionReveal>
          <BudgetCharts />
        </SectionReveal>
      </section>

      <section className="container-page pb-24">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-12 items-baseline border-t border-[var(--hairline)] pt-12">
            <div className="smallcaps md:col-span-3">Commentary</div>
            <p className="font-display md:col-span-9 text-xl md:text-2xl tracking-[-0.005em] leading-[1.55] text-[var(--ink)] max-w-[62ch]">
              {budgetCommentary}
            </p>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
