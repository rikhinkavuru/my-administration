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
        subtitle="No focus-grouped pablum. No populist theater. Twelve positions, written plainly, that together describe how this administration would govern."
      />
      <section className="container-page py-20">
        <SectionReveal>
          <div className="border-t border-[var(--hairline)]">
            {platform.map((issue, i) => (
              <IssueCard key={issue.id} issue={issue} index={i} />
            ))}
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
