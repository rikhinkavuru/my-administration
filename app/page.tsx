import Link from "next/link";
import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import { candidates } from "@/lib/data/candidates";
import { ArrowRight } from "@/components/Icons";

const pillars = [
  { title: "Limited Government", body: "A federal government that does fewer things, but does them well." },
  { title: "Free Markets", body: "Growth, competition, and opportunity — not central planning." },
  { title: "Strong Defense", body: "Peace through strength, alliances that work, and a navy fit for the century." },
  { title: "Constitutional Order", body: "Originalist judges, federalism, and Congress that legislates." },
];

export default function Home() {
  return (
    <div>
      <Hero
        eyebrow={`The ${candidates.party} Ticket — ${candidates.ticket}`}
        title="Renew the Republic."
        subtitle={`${candidates.tagline} Limited government, free markets, strong national defense, and constitutional restoration — the agenda America needs in 2028.`}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[var(--accent)] text-[#0A0E27] font-medium hover:bg-[var(--accent-soft)] transition"
          >
            Read the Platform <ArrowRight size={16} />
          </Link>
          <Link
            href="/strategy"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--fg)] hover:text-[var(--accent)] transition"
          >
            See the Path to 270
          </Link>
        </div>
      </Hero>

      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <SectionReveal>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">The Ticket</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">A serious ticket for a serious moment.</h2>
        </SectionReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <SectionReveal delay={0.05}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8">
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--accent)]">For President</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{candidates.president.name}</div>
              <div className="text-[var(--fg-muted)] text-sm mt-1">{candidates.president.state}</div>
              <p className="mt-5 text-[var(--fg-muted)] leading-relaxed">{candidates.president.bio}</p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.12}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8">
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--accent)]">For Vice President</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight">{candidates.vp.name}</div>
              <p className="mt-5 text-[var(--fg-muted)] leading-relaxed">{candidates.vp.bio}</p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-elev)]/30">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <SectionReveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Four Pillars</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">What we believe.</h2>
          </SectionReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <SectionReveal key={p.title} delay={0.05 * i}>
                <div className="h-full rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 hover:border-[var(--accent)]/50 transition">
                  <div className="font-mono text-xs text-[var(--accent)]">0{i + 1}</div>
                  <div className="mt-3 text-xl font-semibold tracking-tight">{p.title}</div>
                  <div className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">{p.body}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <SectionReveal>
          <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-elev)] to-[var(--bg-elev-2)] p-10 md:p-16">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">Slogan</div>
            <div className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">“{candidates.slogan}.”</div>
            <p className="mt-6 max-w-2xl text-[var(--fg-muted)] leading-relaxed">
              Not a slogan about grievance, and not a slogan about nostalgia. A slogan about the work — the unromantic,
              demanding work of running a constitutional republic the way the Founders meant for it to be run.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/address" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[var(--accent)] text-[#0A0E27] font-medium hover:bg-[var(--accent-soft)] transition">
                Read the State of the Union <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
