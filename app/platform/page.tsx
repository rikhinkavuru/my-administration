import Hero from "@/components/Hero";
import IssueCard from "@/components/IssueCard";
import SectionReveal from "@/components/SectionReveal";
import { platform } from "@/lib/data/platform";

export const metadata = { title: "Platform — Sackett / Kavuru 2028" };

export default function PlatformPage() {
  return (
    <div>
      <Hero
        eyebrow="The Platform"
        title="Twelve serious positions."
        subtitle="No focus-grouped pablum, no populist theater. Twelve positions, written plainly, that together describe how this administration would govern."
      />
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionReveal>
          <div className="grid gap-4 md:gap-5">
            {platform.map((issue, i) => (
              <IssueCard key={issue.id} issue={issue} index={i} />
            ))}
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
