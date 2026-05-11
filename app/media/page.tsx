import type { Metadata } from "next";
import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import { outlets, interestGroups } from "@/lib/data/media";

export const metadata: Metadata = {
  title: "Media & Coalition",
  description:
    "Three media outlets in three formats — the Wall Street Journal editorial page, the Daily Wire, Fox News Sunday — and three interest groups whose alignment and electoral value make them load-bearing partners.",
  alternates: { canonical: "/media" },
  openGraph: {
    title: "Media & Coalition — Sackett / Kavuru 2028",
    description: "Where we make the case. Three formats. Three coalitions.",
    url: "/media",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media & Coalition — Sackett / Kavuru 2028",
    description: "Three formats. Three audiences. Three load-bearing coalitions.",
  },
};

export default function MediaPage() {
  return (
    <div>
      <ChapterIntro
        index="08"
        kicker="Media & Coalition"
        title="Where we make the"
        italicAccent="case."
        lede="Three media outlets in three different formats, and three interest groups whose alignment and electoral value make them load-bearing partners."
      />

      {/* Logo-wall / wordmark band */}
      <section aria-label="As seen in" className="border-b border-[var(--hairline)]">
        <div className="container-page py-10 md:py-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="eyebrow">Carried by</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)] list-none">
            {outlets.map((o) => (
              <li
                key={o.name}
                className="bg-[var(--bg)] px-6 py-7 md:py-9 flex items-center justify-center text-center"
              >
                <span
                  className="font-display text-[18px] md:text-[22px] leading-[1.1] tracking-[-0.02em] text-[var(--fg-60)] hover:text-[var(--fg)] transition-colors"
                  style={{ fontVariantCaps: "all-small-caps", letterSpacing: "0.04em" }}
                >
                  {o.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="outlets-heading" className="container-page py-16 md:py-20">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ A ]</span>
            <span className="eyebrow" id="outlets-heading">Media Outlets</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[20ch]"
          >
            Three formats. Three audiences.
          </SplitText>
        </SectionReveal>

        <ol className="mt-12 grid md:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)] list-none">
          {outlets.map((o, i) => (
            <li key={o.name}>
              <SectionReveal delay={i * 0.05}>
                <article className="bg-[var(--bg)] p-7 md:p-8 h-full flex flex-col">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
                      OUTLET 0{i + 1} / 03
                    </span>
                    <span className="eyebrow !text-[var(--fg-40)]">{o.format}</span>
                  </div>
                  <h3 className="font-display mt-8 text-[26px] md:text-[28px] leading-[1.05]">
                    {o.name}
                  </h3>
                  <p className="mt-5 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                    {o.rationale}
                  </p>
                </article>
              </SectionReveal>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="coalition-heading" className="container-page py-16 md:py-20 pb-24">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ B ]</span>
            <span className="eyebrow" id="coalition-heading">Coalition</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" aria-hidden="true" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[22ch]"
          >
            The three groups we organize first.
          </SplitText>
        </SectionReveal>

        <div className="mt-12 grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] md:grid-cols-3">
          {interestGroups.map((g, i) => (
            <SectionReveal key={g.name} delay={i * 0.05}>
              <div className="bg-[var(--bg)] p-7 md:p-8 h-full">
                <div className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
                  0{i + 1} / 03
                </div>
                <div className="font-display mt-6 text-[26px] md:text-[28px] leading-[1.05]">
                  {g.name}
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--hairline)]">
                  <div className="eyebrow !text-[var(--fg-40)]">Alignment</div>
                  <p className="mt-3 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                    {g.alignment}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--hairline)]">
                  <div className="eyebrow !text-[var(--fg-40)]">Electoral Value</div>
                  <p className="mt-3 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                    {g.electoralValue}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
