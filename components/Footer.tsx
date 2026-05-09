import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--fg-muted)]">2028</div>
          <div className="mt-2 text-lg font-semibold">Sackett / Kavuru</div>
          <div className="text-[var(--fg-muted)] text-sm">Renew the Republic.</div>
        </div>
        <div className="text-sm text-[var(--fg-muted)] space-y-2">
          <div className="text-[var(--fg)] font-medium">Pages</div>
          <div className="grid grid-cols-2 gap-1">
            <Link href="/platform">Platform</Link>
            <Link href="/strategy">Strategy</Link>
            <Link href="/constitution">Constitution</Link>
            <Link href="/executive">Executive</Link>
            <Link href="/judicial">Judicial</Link>
            <Link href="/address">Address</Link>
            <Link href="/budget">Budget</Link>
            <Link href="/media">Media</Link>
          </div>
        </div>
        <div className="text-sm text-[var(--fg-muted)] space-y-3">
          <div className="text-[var(--fg)] font-medium">Sources (APA, abbreviated)</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Congressional Budget Office. (2025). <em>Budget and Economic Outlook: 2025–2035</em>.</li>
            <li>U.S. Census Bureau. (2024). <em>Apportionment Population and Number of Representatives</em>.</li>
            <li>National Review &amp; AEI policy archives, 2020–2026.</li>
            <li>Office of Management and Budget. (2025). <em>Historical Tables</em>.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 text-xs text-[var(--fg-muted)] flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            This is a fictional academic project for AP Government. Not a real political campaign.
          </div>
          <div>© {new Date().getFullYear()} Renew the Republic Project</div>
        </div>
      </div>
    </footer>
  );
}
