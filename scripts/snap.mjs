// scripts/snap.mjs
// Drives Chromium through /platform and /executive to capture screenshots
// at progressive scroll positions inside the scroll-trigger range, plus
// dumps computed transforms / bounding boxes for each card so we can
// diagnose 3D-deck legibility without eyeballing pixels.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = "/tmp/snaps";
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  {
    name: "platform",
    path: "/platform",
    // selector for each card root
    cardSelector: "[data-active]",
    stageSelector: "[style*='perspective']",
  },
  {
    name: "executive",
    path: "/executive",
    cardSelector: "[style*='rotateY']",
    stageSelector: "[style*='perspective']",
  },
];

async function dumpCards(page, label) {
  return page.evaluate((label) => {
    const out = { label, cards: [] };
    // collect both data-active (platform) and rotateY-bearing (cabinet) nodes
    const nodes = Array.from(
      document.querySelectorAll(
        "[data-active], div[style*='translateZ'][style*='rotateY']",
      ),
    );
    for (const n of nodes.slice(0, 30)) {
      const rect = n.getBoundingClientRect();
      const cs = window.getComputedStyle(n);
      out.cards.push({
        tag: n.tagName,
        dataActive: n.getAttribute("data-active"),
        rectX: Math.round(rect.x),
        rectY: Math.round(rect.y),
        rectW: Math.round(rect.width),
        rectH: Math.round(rect.height),
        transform: cs.transform.slice(0, 200),
        opacity: cs.opacity,
        zIndex: cs.zIndex,
        backfaceVisibility: cs.backfaceVisibility,
      });
    }
    return out;
  }, label);
}

async function visit(route) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  console.log(`\n=== ${route.name} (${BASE}${route.path}) ===`);
  await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle" });
  // give gsap a moment to register
  await page.waitForTimeout(800);

  const totalScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  console.log(`scrollHeight - viewport = ${totalScroll}`);

  // Find sticky stage so we can iterate inside its pinned range.
  // We sample 6 absolute scroll positions across the page.
  const positions = [0.05, 0.18, 0.32, 0.5, 0.68, 0.85];
  for (let i = 0; i < positions.length; i++) {
    const y = Math.round(totalScroll * positions[i]);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    // wait for scrub + lenis settle
    await page.waitForTimeout(600);
    const dump = await dumpCards(page, `${route.name} pos=${positions[i]}`);
    console.log(JSON.stringify(dump, null, 2).slice(0, 2400));
    const outPath = path.join(OUT, `${route.name}-${i}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`screenshot -> ${outPath}`);
  }

  await browser.close();
}

(async () => {
  for (const r of ROUTES) await visit(r);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
