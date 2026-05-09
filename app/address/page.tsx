import SectionReveal from "@/components/SectionReveal";
import { stateOfTheUnion } from "@/lib/data/address";

export const metadata = { title: "State of the Union — Sackett / Kavuru 2028" };

export default function AddressPage() {
  return (
    <div>
      <header className="border-b border-[var(--hairline)]">
        <div className="container-page pt-24 md:pt-36 pb-16 md:pb-20">
          <SectionReveal>
            <div className="smallcaps">State of the Union, 2029</div>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <h1 className="font-display mt-6 text-5xl md:text-8xl tracking-[-0.02em] font-medium leading-[0.95] max-w-[12ch]">
              My fellow Americans.
            </h1>
          </SectionReveal>
          <SectionReveal delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-2">
              {stateOfTheUnion.themes.map((t, i) => (
                <span
                  key={t}
                  className="text-xs text-[var(--ink-muted)] border border-[var(--hairline-strong)] rounded-full px-3 py-1"
                >
                  <span className="font-mono text-[var(--accent)] mr-2">0{i + 1}</span>
                  {t}
                </span>
              ))}
            </div>
          </SectionReveal>
        </div>
      </header>

      <section className="container-page py-20 md:py-28">
        <article className="font-display mx-auto max-w-[64ch] text-[19px] md:text-[20px] leading-[1.85] text-[var(--ink)] space-y-9">
          {stateOfTheUnion.paragraphs.map((p, i) => (
            <SectionReveal key={i} delay={i * 0.04}>
              <p className={i === 0 ? "dropcap" : ""}>{p}</p>
            </SectionReveal>
          ))}
          <SectionReveal>
            <div className="pt-12 border-t border-[var(--hairline)] text-[var(--ink-muted)] text-sm not-italic" style={{ fontFamily: "var(--font-geist-sans)" }}>
              Delivered to a Joint Session of the 121st Congress.
            </div>
          </SectionReveal>
        </article>
      </section>
    </div>
  );
}
