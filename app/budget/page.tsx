import type { Metadata } from "next";
import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import BudgetChartsWrapper from "./BudgetChartsWrapper";
import { budgetCommentary, currentBudget, proposedBudget } from "@/lib/data/budget";

export const metadata: Metadata = {
  title: "Federal Budget",
  description:
    "The current federal budget, the Sackett / Kavuru proposed budget, and a plain explanation of what changes and why. Defense to 4% of GDP, honest entitlement reform, a 4% debt-reduction set-aside.",
  alternates: { canonical: "/budget" },
  openGraph: {
    title: "Budget — Sackett / Kavuru 2028",
    description:
      "Honest math, honest priorities. Defense, entitlements, and a 4% debt-reduction set-aside.",
    url: "/budget",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget — Sackett / Kavuru 2028",
    description: "Honest math. Honest priorities.",
  },
};

// Find delta context numbers
const defenseCurrent = currentBudget.find((b) => b.category === "Defense")?.value ?? 0;
const defenseProposed = proposedBudget.find((b) => b.category === "Defense")?.value ?? 0;
const debtSetAside =
  proposedBudget.find((b) => b.category === "Debt Reduction Set-Aside")?.value ?? 0;
const netInterest = currentBudget.find((b) => b.category === "Net Interest")?.value ?? 0;

const STATS: Array<{ value: string; label: string; sub: string }> = [
  {
    value: `${defenseCurrent}% → ${defenseProposed}%`,
    label: "Defense share of budget",
    sub: "Recapitalize a hollowed-out force; target 4% of GDP.",
  },
  {
    value: `${debtSetAside}%`,
    label: "Debt-reduction set-aside",
    sub: "Dedicated to accelerated principal reduction.",
  },
  {
    value: `${netInterest}%`,
    label: "Net interest, today",
    sub: "More than veterans, education, and transport combined.",
  },
];

export default function BudgetPage() {
  return (
    <div>
      <ChapterIntro
        index="07"
        kicker="Federal Budget"
        title="Honest math."
        italicAccent="Honest priorities."
        lede="The current federal budget, the Sackett / Kavuru proposed budget, and a plain explanation of what changes — and why."
      />

      <section
        aria-labelledby="budget-chart-heading"
        className="container-page py-12"
      >
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ A ]</span>
            <h2 className="eyebrow" id="budget-chart-heading">
              The numbers
            </h2>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
            <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
              FY 2025 baseline
            </span>
          </div>
          <BudgetChartsWrapper />
        </SectionReveal>
      </section>

      <section
        aria-labelledby="budget-context-heading"
        className="container-page py-12"
      >
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ B ]</span>
            <h2 className="eyebrow" id="budget-context-heading">
              In context
            </h2>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
          </div>
          <dl className="grid md:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[var(--bg)] p-7 md:p-8">
                <dt className="eyebrow !text-[var(--fg-40)]">{s.label}</dt>
                <dd className="font-display mt-5 text-[44px] md:text-[56px] leading-[0.96] tabular-nums">
                  {s.value}
                </dd>
                <p className="mt-5 text-[13px] text-[var(--fg-60)] leading-[1.7]">
                  {s.sub}
                </p>
              </div>
            ))}
          </dl>
        </SectionReveal>
      </section>

      <section
        aria-labelledby="budget-commentary-heading"
        className="container-page py-16 pb-24"
      >
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ C ]</span>
            <h2 className="eyebrow" id="budget-commentary-heading">
              Commentary
            </h2>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
          </div>

          <figure className="card p-10 md:p-16 relative overflow-hidden">
            <span
              aria-hidden
              className="absolute -top-4 left-6 md:left-10 font-serif-italic text-[var(--accent-red)] opacity-30 text-[160px] md:text-[220px] leading-none select-none"
            >
              &ldquo;
            </span>
            <blockquote className="relative">
              <p className="font-serif-italic text-[26px] md:text-[40px] leading-[1.3] tracking-[-0.01em] text-[var(--fg)] max-w-[42ch]">
                A republic that cannot live within its means cannot long live free.
              </p>
              <p className="mt-10 max-w-[58ch] text-[16px] md:text-[20px] leading-[1.65] text-[var(--fg-60)]">
                {budgetCommentary}
              </p>
            </blockquote>
            <figcaption className="mt-10 pt-6 border-t border-[var(--hairline)] font-mono text-[10px] tabular-nums tracking-[0.08em] uppercase text-[var(--fg-40)] flex items-center justify-between gap-4">
              <span>Office of Management &amp; Budget — Proposed FY 2030</span>
              <span className="text-[var(--accent-red)]">Sackett / Kavuru</span>
            </figcaption>
          </figure>
        </SectionReveal>
      </section>
    </div>
  );
}
