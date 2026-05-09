import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import { stateOfTheUnion } from "@/lib/data/address";

export const metadata = { title: "State of the Union — Sackett / Kavuru 2028" };

export default function AddressPage() {
  return (
    <div>
      <Hero
        eyebrow="State of the Union, 2029"
        title="My fellow Americans."
        subtitle="Three themes, in this order: Fiscal Renewal. Border &amp; Sovereignty. Constitutional Restoration."
      />

      <section className="max-w-[820px] mx-auto px-6 py-20">
        <SectionReveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {stateOfTheUnion.themes.map((t, i) => (
              <span key={t} className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)] border border-[var(--accent)]/40 rounded-full px-3 py-1">
                0{i + 1} — {t}
              </span>
            ))}
          </div>
        </SectionReveal>

        <article className="prose-lg space-y-8">
          {stateOfTheUnion.paragraphs.map((p, i) => (
            <SectionReveal key={i} delay={i * 0.04}>
              <p className={`leading-[1.85] ${i === 0 ? "text-2xl md:text-3xl font-semibold tracking-tight text-[var(--fg)]" : "text-lg text-[var(--fg)]/90"}`}>
                {p}
              </p>
            </SectionReveal>
          ))}
        </article>
      </section>
    </div>
  );
}
