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
        title="Twelve serious positions."
        lede="No focus-grouped pablum. No populist theater. Twelve positions, written plainly, that together describe how this administration would govern."
      />
      <section className="container-page pb-24">
        <div className="grid gap-4 md:gap-5">
          {platform.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
