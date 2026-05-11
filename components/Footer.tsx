import Link from "next/link";

const PAGES = [
  ["/platform", "Platform"],
  ["/strategy", "Strategy"],
  ["/constitution", "Constitution"],
  ["/executive", "Executive"],
  ["/judicial", "Judicial"],
  ["/address", "Address"],
  ["/budget", "Budget"],
  ["/media", "Media"],
] as const;

const SOURCES = [
  ["Federalist Papers", "fed.papers"],
  ["U.S. Constitution", "1787 / amendments"],
  ["Cook Political Report", "PVI / electoral data"],
  ["CBO Budget Outlook", "FY 2025"],
  ["AEI / Hoover policy", "research"],
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-32 border-t border-[var(--hairline)] relative bg-[var(--bg)]">
      {/* Big display sign-off */}
      <div className="container-page pt-20 md:pt-28 pb-12">
        <div className="flex items-baseline gap-3 mb-10">
          <span className="section-marker">[ 0F ]</span>
          <span className="eyebrow">Sign-off</span>
          <span className="flex-1 h-px bg-[var(--hairline)]" />
          <span className="font-mono text-[10px] tabular-nums text-[var(--fg-40)] tracking-[0.06em]">
            END · 2028
          </span>
        </div>

        <div className="font-display text-[14vw] md:text-[160px] lg:text-[200px] leading-[0.88] tracking-[-0.045em]">
          Renew the
          <br />
          <span className="font-serif-italic text-[var(--accent-red)]">Republic.</span>
        </div>
      </div>

      {/* Three-column directory */}
      <div className="border-t border-[var(--hairline)]">
        <div className="container-page py-14 grid gap-12 md:grid-cols-12">
          {/* Identity */}
          <div className="md:col-span-5">
            <div className="eyebrow mb-5">Ticket</div>
            <div className="font-mono text-[13px] tracking-[0.06em] uppercase text-[var(--fg)] leading-[1.7]">
              Sackett <span className="text-[var(--accent-red)]">/</span> Kavuru
              <br />
              <span className="text-[var(--fg-60)]">Republican — 2028</span>
            </div>
            <p className="mt-6 max-w-sm text-[13px] leading-[1.7] text-[var(--fg-60)]">
              A fictional 2028 campaign site exploring what a serious,
              limited-government Republican ticket could look like —{" "}
              <span className="font-serif-italic text-[var(--accent-red)]">
                a thought experiment, not an endorsement.
              </span>
            </p>
          </div>

          {/* Pages */}
          <div className="md:col-span-3">
            <div className="eyebrow mb-5">Pages</div>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-2 gap-x-6 text-[13px]">
              {PAGES.map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="link-underline text-[var(--fg-60)] hover:text-[var(--fg)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div className="md:col-span-4">
            <div className="eyebrow mb-5">Sources</div>
            <ul className="space-y-2.5 text-[12px]">
              {SOURCES.map(([name, note]) => (
                <li
                  key={name}
                  className="grid grid-cols-[1fr_auto] gap-4 items-baseline border-b border-[var(--hairline)] pb-2 last:border-0"
                >
                  <span className="text-[var(--fg-60)]">{name}</span>
                  <span className="font-mono text-[10px] text-[var(--fg-40)] tracking-[0.06em] uppercase tabular-nums">
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className="border-t border-[var(--hairline)]">
        <div className="container-page py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[11px] text-[var(--fg-40)] font-mono uppercase tracking-[0.06em]">
          <div>
            © {year} Sackett <span className="text-[var(--accent-red)]">/</span> Kavuru 2028 — fictional
          </div>
          <div className="flex items-center gap-4">
            <span>Renew the Republic</span>
            <span className="text-[var(--fg-20)]">·</span>
            <span>v 1.0 · build {year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
