# My Administration — Sackett / Kavuru 2028

> A fictional presidential platform site for an AP Government class project.
> Slogan: **"Renew the Republic."**

A polished Next.js 16 / Tailwind v4 site presenting a moderate-conservative
(Reagan–Romney lane) Republican platform: limited government, free markets,
strong national defense, traditional institutions, fiscal responsibility, and
an originalist judiciary.

The visual system is 24Labs-inspired: pitch-black background, white at four
alpha tiers, hairline borders, a single Republican-red accent (`#D63D44`)
used sparingly, Geist Sans display + Noto Serif italic accents + Kode Mono
`/// LABEL ›››` eyebrows.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Framer Motion** — page reveals, scroll progress, the 270 gauge
- **Recharts** — budget donut charts (lazy-loaded)
- **react-simple-maps** — interactive electoral map (lazy-loaded)
- **three.js / @react-three/fiber** — the home-page F-22 flyby
- **gsap** — F-22 scroll-trigger choreography
- **Lenis** — smooth scroll

## Pages

| Path            | Chapter                                                             |
| --------------- | ------------------------------------------------------------------- |
| `/`             | Home / hero / F-22 flyby                                            |
| `/platform`     | 01 — twelve issue positions                                         |
| `/strategy`     | 02 — coalition math, 270 gauge, electoral map, battlegrounds        |
| `/constitution` | 03 — proposed amendments + civil liberties                          |
| `/executive`    | 04 — bureaucratic vision + 15 cabinet nominees                      |
| `/judicial`     | 05 — SCOTUS nominee, philosophy, litmus tests                       |
| `/address`      | 06 — first State of the Union (drop-cap serif body, reading bar)    |
| `/budget`       | 07 — current vs. proposed budget + commentary pull-quote            |
| `/media`        | 08 — media outlets + interest-group coalition                       |

All inner pages share a `ChapterIntro` lede, breadcrumb nav, dedicated
metadata (OG + Twitter cards), and structured-data (JSON-LD) where useful.

## Performance notes

- Heavy `recharts` and `react-simple-maps` bundles are loaded via
  `next/dynamic` so they ship only with the routes that need them.
- `next.config.ts` enables `optimizePackageImports` for framer-motion,
  recharts, and react-simple-maps to trim transitive imports.
- App icons (`icon.tsx`, `apple-icon.tsx`) and the social card
  (`opengraph-image.tsx` / `twitter-image.tsx`) are generated at build
  time via `next/og`.
- `manifest.ts` provides a PWA manifest; `viewport.themeColor` sets the
  mobile chrome color.

## Setup

```bash
npm install --legacy-peer-deps
npm run dev
```

Then open <http://localhost:3000>.

> `--legacy-peer-deps` is required because `react-simple-maps` declares a peer
> range that predates React 19. The library functions correctly at runtime.

## Build

```bash
npm run build
```

The build is fully static — all 10 routes prerender to HTML.

## Environment

| Variable               | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Absolute base for canonical and OG URLs.       |

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

Push to a GitHub repo, import the repo on Vercel, accept the defaults, and
set `NEXT_PUBLIC_SITE_URL` if you want canonical URLs to point at your
production domain.

## Disclaimer

This site is a **fictional academic project for AP Government**. It is
**not** a real political campaign, is not affiliated with any real political
candidate, party, or committee, and exists solely as a class assignment.
Real public figures named as cabinet, judicial, or media examples are
used only for illustrative academic purposes.
