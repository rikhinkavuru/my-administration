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
        subtitle="The current federal budget, the Sackett / Kavuru proposed budget, and a clear explanation of what changes and why."
      />

      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <SectionReveal>
          <BudgetCharts />
        </SectionReveal>
      </section>

      <section className="max-w-[1000px] mx-auto px-6 pb-24">
        <SectionReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 md:p-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Commentary</div>
            <p className="mt-4 text-lg md:text-xl leading-relaxed text-[var(--fg)]">{budgetCommentary}</p>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
