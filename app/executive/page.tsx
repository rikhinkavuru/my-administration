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
        subtitle="A bureaucratic vision and fifteen confirmable cabinet nominees — each chosen for substance and the realistic prospect of Senate confirmation."
      />

      <section className="container-page py-20 md:py-24">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">Bureaucratic Vision</div>
            <p className="font-display md:col-span-9 text-2xl md:text-3xl tracking-[-0.01em] leading-[1.4] text-[var(--ink)] max-w-[42ch]">
              {bureaucraticVision}
            </p>
          </div>
        </SectionReveal>
      </section>

      <section className="border-t border-[var(--hairline)]">
        <div className="container-page py-20 md:py-24">
          <SectionReveal>
            <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
              <div className="smallcaps md:col-span-3">The Cabinet</div>
              <h2 className="font-display md:col-span-9 text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[22ch]">Fifteen confirmable nominees.</h2>
            </div>
          </SectionReveal>
          <div className="mt-14 border-t border-l border-[var(--hairline)] grid sm:grid-cols-2 lg:grid-cols-3">
            {cabinet.map((c, i) => (
              <CabinetCard key={c.department} pick={c} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
