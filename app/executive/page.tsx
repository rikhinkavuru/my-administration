import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import CabinetCard from "@/components/CabinetCard";
import { cabinet } from "@/lib/data/cabinet";
import { bureaucraticVision } from "@/lib/data/executive";

export const metadata = { title: "Executive — Sackett / Kavuru 2028" };

export default function ExecutivePage() {
  return (
    <div>
      <Hero
        eyebrow="Executive Branch"
        title="A government that serves."
        subtitle="A bureaucratic vision and fifteen confirmable cabinet nominees, each chosen for substance and for the realistic prospect of Senate confirmation."
      />

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 md:p-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Bureaucratic Vision</div>
            <p className="mt-4 text-xl md:text-2xl leading-relaxed text-[var(--fg)]">{bureaucraticVision}</p>
          </div>
        </SectionReveal>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 pb-24">
        <SectionReveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">The Cabinet</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">Fifteen confirmable nominees.</h2>
        </SectionReveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cabinet.map((c, i) => (
            <CabinetCard key={c.department} pick={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
