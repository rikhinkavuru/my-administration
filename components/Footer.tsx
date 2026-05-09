import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--hairline)]">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-display text-[10vw] md:text-[120px] leading-[0.92] font-bold tracking-[-0.04em]">
              Renew the <span className="font-serif-italic text-[var(--fg-60)]">Republic.</span>
            </div>
          </div>
          <div className="md:col-span-3 md:col-start-9">
            <div className="eyebrow mb-4">Pages</div>
            <ul className="space-y-2 text-[13px]">
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
                  <Link
                    href={href}
                    className="text-[var(--fg-60)] hover:text-[var(--fg)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--hairline)]">
        <div className="container-page py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[11px] text-[var(--fg-40)] font-mono uppercase tracking-[0.06em]">
          <div>© {new Date().getFullYear()} Sackett / Kavuru 2028</div>
          <div className="flex items-center gap-4">
            <span>Republican — Renew the Republic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
