import ChapterIntro from "@/components/ChapterIntro";
import IssueCard from "@/components/IssueCard";
import { platform } from "@/lib/data/platform";

export const metadata = { title: "Platform — Sackett / Kavuru 2028" };

export default function PlatformPage() {
  return (
    <div>
      <ChapterIntro
        index="01"
        kicker="The Platform"
        title="Twelve serious"
        italicAccent="positions."
        lede="No focus-grouped pablum. No populist theater. Twelve positions, written plainly, that together describe how this administration would govern."
      />
      <section className="container-page py-20 md:py-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="eyebrow">12 positions</span>
          <span className="flex-1 h-px bg-[var(--hairline)]" />
          <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
            Tap to expand
          </span>
        </div>
        <div className="grid gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          {platform.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
