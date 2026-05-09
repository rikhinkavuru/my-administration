import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--hairline)]">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-2xl tracking-tight">
              Sackett <span className="text-[var(--ink-muted)]">/</span> Kavuru
            </div>
            <div className="text-sm text-[var(--ink-muted)] mt-2 max-w-md leading-relaxed">
              Renew the Republic. A serious agenda for a serious moment.
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
                  <Link href={href} className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="smallcaps mb-4">Sources</div>
            <ul className="space-y-2 text-sm text-[var(--ink-muted)] leading-relaxed">
              <li>Congressional Budget Office. (2025). <em>Budget and Economic Outlook: 2025–2035.</em></li>
              <li>U.S. Census Bureau. (2024). <em>Apportionment Population.</em></li>
              <li>Office of Management and Budget. (2025). <em>Historical Tables.</em></li>
              <li>National Review &amp; AEI policy archives, 2020–2026.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--hairline)]">
        <div className="container-page py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-[var(--ink-muted)]">
          <div>This is a fictional academic project for AP Government. Not a real political campaign.</div>
          <div>© {new Date().getFullYear()} Renew the Republic Project</div>
        </div>
      </div>
    </footer>
  );
}
