import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import { candidates } from "@/lib/data/candidates";
import { ArrowRight } from "@/components/Icons";

const pillars = [
  { title: "Limited government", body: "A federal government that does fewer things, but does them well." },
  { title: "Free markets", body: "Growth, competition, and opportunity — not central planning." },
  { title: "Strong defense", body: "Peace through strength. Alliances that work. A navy fit for the century." },
  { title: "Constitutional order", body: "Originalist judges. Federalism. A Congress that legislates." },
];

export default function Home() {
  return (
    <div>
      {/* Masthead */}
      <section className="border-b border-[var(--hairline)]">
        <div className="container-page pt-24 md:pt-36 pb-20 md:pb-32">
          <SectionReveal>
            <div className="smallcaps">{candidates.party} · {candidates.ticket}</div>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <h1 className="font-display mt-7 text-[56px] sm:text-7xl md:text-[112px] leading-[0.95] font-medium tracking-[-0.025em] max-w-[14ch]">
              Renew the Republic.
            </h1>
          </SectionReveal>
          <SectionReveal delay={0.18}>
            <p className="mt-10 max-w-2xl text-lg md:text-xl text-[var(--ink-muted)] leading-[1.65]">
              {candidates.tagline} Limited government, free markets, strong
              national defense, and constitutional restoration — the agenda
              America needs in 2028.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.28}>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/platform" className="btn btn-primary group">
                Read the platform
                <ArrowRight size={16} />
              </Link>
              <Link href="/strategy" className="btn btn-ghost">See the path to 270</Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Ticket */}
      <section className="container-page py-24 md:py-32">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">The Ticket</div>
            <h2 className="font-display md:col-span-9 text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[20ch]">
              A serious ticket for a serious moment.
            </h2>
          </div>
        </SectionReveal>

        <div className="mt-16 grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--hairline)] border-y border-[var(--hairline)]">
          <SectionReveal delay={0.05}>
            <div className="py-10 md:py-12 md:pr-12">
              <div className="smallcaps">For President</div>
              <div className="font-display mt-4 text-4xl md:text-5xl tracking-tight font-medium">{candidates.president.name}</div>
              <div className="text-[var(--ink-muted)] text-sm mt-1">{candidates.president.state}</div>
              <p className="mt-6 text-[var(--ink-muted)] leading-[1.7] max-w-prose">{candidates.president.bio}</p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.12}>
            <div className="py-10 md:py-12 md:pl-12">
              <div className="smallcaps">For Vice President</div>
              <div className="font-display mt-4 text-4xl md:text-5xl tracking-tight font-medium">{candidates.vp.name}</div>
              <p className="mt-6 text-[var(--ink-muted)] leading-[1.7] max-w-prose">{candidates.vp.bio}</p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page pb-24 md:pb-32">
        <SectionReveal>
          <div className="grid gap-x-12 gap-y-4 md:grid-cols-12 items-baseline">
            <div className="smallcaps md:col-span-3">What we believe</div>
            <h2 className="font-display md:col-span-9 text-3xl md:text-5xl tracking-tight font-medium leading-[1.1] max-w-[22ch]">
              Four ideas, in plain language.
            </h2>
          </div>
        </SectionReveal>
        <div className="mt-16 grid md:grid-cols-2">
          {pillars.map((p, i) => (
            <SectionReveal key={p.title} delay={0.05 * i}>
              <div
                className={`py-10 md:py-12 md:px-10 border-b border-[var(--hairline)] ${
                  i % 2 === 0 ? "md:border-r" : ""
                } ${i >= 2 ? "md:border-b-0" : ""}`}
              >
                <div className="font-mono text-xs text-[var(--ink-faint)] tabular-nums">0{i + 1}</div>
                <div className="font-display mt-3 text-2xl md:text-3xl tracking-tight font-medium">{p.title}</div>
                <div className="mt-3 text-[var(--ink-muted)] leading-relaxed max-w-md">{p.body}</div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Pull-quote */}
      <section className="border-t border-[var(--hairline)]">
        <div className="container-page py-24 md:py-32">
          <SectionReveal>
            <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl tracking-[-0.015em] font-medium leading-[1.1] max-w-[24ch]">
              <span className="text-[var(--accent)]">“</span>{candidates.slogan}<span className="text-[var(--accent)]">.”</span>
            </blockquote>
            <p className="mt-10 max-w-2xl text-[var(--ink-muted)] leading-[1.7]">
              Not a slogan about grievance, and not a slogan about nostalgia.
              A slogan about the work — the unromantic, demanding work of
              running a constitutional republic the way the Founders meant for
              it to be run.
            </p>
            <div className="mt-10">
              <Link href="/address" className="btn btn-primary">
                Read the State of the Union
                <ArrowRight size={16} />
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
