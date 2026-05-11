import type { Metadata } from "next";
import Link from "next/link";
import ChapterIntro from "@/components/ChapterIntro";
import PlatformDeck3DMount from "@/components/3d/PlatformDeck3DMount";
import { platform } from "@/lib/data/platform";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Twelve plainly-written positions — taxes, spending, healthcare, energy, immigration, defense, entitlements, and the rest — that together describe how a Sackett / Kavuru administration would govern.",
  alternates: { canonical: "/platform" },
  openGraph: {
    title: "Platform — Sackett / Kavuru 2028",
    description:
      "Twelve plainly-written positions. No focus-grouped pablum. No populist theater.",
    url: "/platform",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform — Sackett / Kavuru 2028",
    description: "Twelve plainly-written positions.",
  },
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "/" },
    { "@type": "ListItem", position: 2, name: "Platform", item: "/platform" },
  ],
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Sackett / Kavuru 2028 — Platform",
  numberOfItems: platform.length,
  itemListElement: platform.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.title,
    description: p.summary,
  })),
};

export default function PlatformPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbsJsonLd, itemListJsonLd]),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="container-page pt-24 md:pt-32 pb-2 font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.08em] uppercase"
      >
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--fg)] transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-[var(--fg-60)]">
            Platform
          </li>
        </ol>
      </nav>

      <ChapterIntro
        index="01"
        kicker="The Platform"
        title="Twelve serious"
        italicAccent="positions."
        lede="No focus-grouped pablum. No populist theater. Twelve positions, written plainly, that together describe how this administration would govern from day one."
      />

      <section
        aria-labelledby="platform-list-heading"
        className="container-page py-20 md:py-24"
      >
        <div className="flex items-center gap-4 mb-10">
          <h2 className="eyebrow" id="platform-list-heading">
            12 positions
          </h2>
          <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
          <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
            Tap to expand
          </span>
        </div>
        <PlatformDeck3DMount issues={platform} />

        <aside
          aria-label="Continue reading"
          className="mt-16 grid md:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)]"
        >
          <Link
            href="/strategy"
            className="bg-[var(--bg)] p-7 hover:bg-[var(--bg-elev)] transition-colors"
          >
            <div className="eyebrow !text-[var(--fg-40)]">Next</div>
            <div className="font-display mt-4 text-[28px] leading-[1.05]">
              02 — Strategy
            </div>
            <p className="mt-4 text-[13px] text-[var(--fg-60)] leading-[1.7]">
              The coalition math, the four must-win states, the path to 270.
            </p>
          </Link>
          <Link
            href="/constitution"
            className="bg-[var(--bg)] p-7 hover:bg-[var(--bg-elev)] transition-colors"
          >
            <div className="eyebrow !text-[var(--fg-40)]">Then</div>
            <div className="font-display mt-4 text-[28px] leading-[1.05]">
              03 — Constitution
            </div>
            <p className="mt-4 text-[13px] text-[var(--fg-60)] leading-[1.7]">
              Two amendments to send to the states; three civil liberties to defend without apology.
            </p>
          </Link>
          <Link
            href="/budget"
            className="bg-[var(--bg)] p-7 hover:bg-[var(--bg-elev)] transition-colors"
          >
            <div className="eyebrow !text-[var(--fg-40)]">Then</div>
            <div className="font-display mt-4 text-[28px] leading-[1.05]">
              07 — Budget
            </div>
            <p className="mt-4 text-[13px] text-[var(--fg-60)] leading-[1.7]">
              Where the numbers actually land. Honest math, honest priorities.
            </p>
          </Link>
        </aside>
      </section>
    </div>
  );
}
