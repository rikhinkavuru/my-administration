import type { Metadata } from "next";
import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import CabinetCarousel3DMount from "@/components/3d/CabinetCarousel3DMount";
import { cabinet } from "@/lib/data/cabinet";
import { bureaucraticVision } from "@/lib/data/executive";

export const metadata: Metadata = {
  title: "Executive Branch",
  description:
    "A bureaucratic vision and fifteen confirmable cabinet nominees — each chosen for substance and a realistic prospect of Senate confirmation on day one.",
  alternates: { canonical: "/executive" },
  openGraph: {
    title: "Executive — Sackett / Kavuru 2028",
    description:
      "Fifteen confirmable cabinet nominees. A government that serves.",
    url: "/executive",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Executive — Sackett / Kavuru 2028",
    description: "Fifteen confirmable cabinet nominees.",
  },
};

const cabinetJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Proposed Cabinet",
  numberOfItems: 15,
  itemListElement: [] as Array<{ "@type": string; position: number; name: string }>,
};

export default function ExecutivePage() {
  cabinetJsonLd.itemListElement = cabinet.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${c.department} — ${c.nominee}`,
  }));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cabinetJsonLd) }}
      />

      <ChapterIntro
        index="04"
        kicker="Executive Branch"
        title="A government that"
        italicAccent="serves."
        lede="A bureaucratic vision and fifteen confirmable cabinet nominees — each chosen for substance and the realistic prospect of Senate confirmation on day one."
      />

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="card p-10 md:p-14">
            <div className="eyebrow">Bureaucratic Vision</div>
            <p className="mt-8 text-[24px] md:text-[34px] tracking-[-0.015em] leading-[1.4] text-[var(--fg)] max-w-[44ch]">
              {bureaucraticVision}
            </p>
          </div>
        </SectionReveal>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ 15 ]</span>
            <span className="eyebrow">The Cabinet</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[20ch]"
          >
            Fifteen confirmable nominees.
          </SplitText>
        </SectionReveal>

        <CabinetCarousel3DMount picks={cabinet} />
      </section>
    </div>
  );
}
