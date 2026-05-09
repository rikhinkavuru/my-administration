import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--hairline)] relative z-10">
      <div className="container-page py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="font-display text-[44px] md:text-6xl tracking-[-0.02em] leading-[0.95] font-medium">
              Renew <br /> the Republic.
            </div>
            <div className="text-sm text-[var(--ink-muted)] mt-5 max-w-md leading-relaxed">
              A serious agenda for a serious moment. Sackett <span className="text-[var(--accent)]">/</span> Kavuru 2028.
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="smallcaps mb-4">Pages</div>
            <ul className="space-y-2 text-sm">
              {[
                ["/platform", "Platform"],
                ["/strategy", "Strategy"],
                ["/constitution", "Constitution"],
                ["/executive", "Executive"],
                ["/judicial", "Judicial"],
                ["/address", "Address"],
                ["/budget", "Budget"],
                ["/media", "Media"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition link-underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="smallcaps mb-4">Sources</div>
            <ul className="space-y-2 text-xs text-[var(--ink-muted)] leading-relaxed">
              <li>Congressional Budget Office (2025).</li>
              <li>U.S. Census Bureau (2024).</li>
              <li>Office of Management and Budget (2025).</li>
              <li>National Review &amp; AEI archives.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--hairline)]">
        <div className="container-page py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-[var(--ink-muted)]">
          <div>Sackett <span className="text-[var(--accent)]">/</span> Kavuru 2028</div>
          <div>© {new Date().getFullYear()} Renew the Republic Project</div>
        </div>
      </div>
    </footer>
  );
}
