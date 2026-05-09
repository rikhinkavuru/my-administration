# My Administration — Sackett / Kavuru 2028

> A fictional presidential platform site for an AP Government class project.
> Slogan: **“Renew the Republic.”**

A polished Next.js 15 / Tailwind v4 site presenting a moderate-conservative
(Reagan–Romney lane) Republican platform: limited government, free markets,
strong national defense, traditional institutions, fiscal responsibility, and
an originalist judiciary.

## Stack

- Next.js 15 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Framer Motion (animations)
- Recharts (budget donut charts)
- react-simple-maps + d3-geo (interactive electoral map)
- Lenis (smooth scroll)
- Geist (default with Next.js)

## Pages (each a rubric section)

| Path | Section |
| --- | --- |
| `/` | Home / hero |
| `/platform` | 12 issue positions |
| `/strategy` | Slogan, electoral map, EV counter, battlegrounds |
| `/constitution` | Proposed amendments + civil liberties |
| `/executive` | Bureaucratic vision + 15 cabinet nominees |
| `/judicial` | SCOTUS nominee, philosophy, litmus tests |
| `/address` | Five-paragraph State of the Union |
| `/budget` | Current vs. proposed budget pie charts |
| `/media` | Media outlets + interest group coalition |

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

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

Push to a GitHub repo, import the repo on Vercel, and accept the defaults.
No environment variables are required.

## Disclaimer

This site is a **fictional academic project for AP Government**. It is
**not** a real political campaign, is not affiliated with any real political
candidate, party, or committee, and exists solely as a class assignment.
Real public figures named as cabinet, judicial, or media examples are
used only for illustrative academic purposes.
