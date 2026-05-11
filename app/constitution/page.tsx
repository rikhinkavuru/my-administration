import type { Metadata } from "next";
import Link from "next/link";
import ChapterIntro from "@/components/ChapterIntro";
import SectionReveal from "@/components/SectionReveal";
import SplitText from "@/components/SplitText";
import { amendments, liberties } from "@/lib/data/constitution";

export const metadata: Metadata = {
  title: "Constitution",
  description:
    "Two proposed amendments to send to the states — congressional term limits and a balanced-budget amendment — and three civil liberties this administration will defend without apology.",
  alternates: { canonical: "/constitution" },
  openGraph: {
    title: "Constitution — Sackett / Kavuru 2028",
    description:
      "Two proposed amendments. Three civil liberties defended without apology.",
    url: "/constitution",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Constitution — Sackett / Kavuru 2028",
    description: "Two amendments. Three liberties. Restored constitutional order.",
  },
};

export default function ConstitutionPage() {
  return (
    <div>
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
            Constitution
          </li>
        </ol>
      </nav>

      <ChapterIntro
        index="03"
        kicker="Proposed Amendments & Civil Liberties"
        title="Restore the constitutional"
        italicAccent="order."
        lede="Two amendments to send to the states. Three civil liberties this administration will defend without apology — and without exception."
      />

      <section className="container-page py-20 md:py-24">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ A ]</span>
            <span className="eyebrow">Proposed Amendments</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[20ch]"
          >
            Two amendments. Both overdue.
          </SplitText>
        </SectionReveal>

        <div className="mt-14 grid md:grid-cols-2 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
          {amendments.map((a, i) => (
            <SectionReveal key={a.title} delay={i * 0.06}>
              <div className="bg-[var(--bg)] p-8 md:p-10 h-full flex flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] text-[var(--accent-red)] tabular-nums tracking-[0.06em]">
                    AMENDMENT 0{i + 1}
                  </span>
                  <span className="eyebrow !text-[var(--fg-40)]">Proposed</span>
                </div>
                <h3 className="font-display mt-6 text-[32px] md:text-[40px] leading-[1]">{a.title}</h3>
                <p className="mt-8 text-[18px] md:text-[22px] leading-[1.45] text-[var(--fg)] font-serif-italic">
                  “{a.text}”
                </p>
                <div className="mt-auto pt-8">
                  <div className="eyebrow !text-[var(--fg-40)]">Why</div>
                  <p className="mt-3 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                    {a.rationale}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="container-page py-24">
        <SectionReveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[10px] tabular-nums text-[var(--accent-red)]">[ B ]</span>
            <span className="eyebrow">Civil Liberties</span>
            <span className="flex-1 h-px bg-[var(--hairline)]" />
          </div>
          <SplitText
            as="h2"
            splitBy="word"
            stagger={0.05}
            className="font-display text-[40px] sm:text-[60px] md:text-[88px] max-w-[20ch]"
          >
            Three rights. No retreat.
          </SplitText>
        </SectionReveal>

        <div className="mt-12 grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] md:grid-cols-3">
          {liberties.map((l, i) => (
            <SectionReveal key={l.title} delay={i * 0.06}>
              <div className="bg-[var(--bg)] p-7 md:p-8 h-full">
                <div className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
                  0{i + 1} / 03
                </div>
                <div className="font-display mt-6 text-[26px] md:text-[28px] leading-[1.05]">
                  {l.title}
                </div>
                <p className="mt-5 text-[13px] md:text-[14px] text-[var(--fg-60)] leading-[1.7]">
                  {l.body}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
