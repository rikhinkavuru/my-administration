// scripts/snap-city.mjs
// Diagnostic for the /platform city sequence.
// Captures screenshots at 8 progressive scroll positions, dumps:
//   - .vignette computed style
//   - canvas size + corner pixel colors
//   - body bg
//   - window.__city debug global (if present)
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = "/tmp/snaps";
const TAG = process.env.TAG || "before";
fs.mkdirSync(OUT, { recursive: true });

const POSITIONS = [0.02, 0.08, 0.13, 0.22, 0.35, 0.5, 0.7, 0.88];

async function sample(page) {
  return page.evaluate(() => {
    const out = {};
    const v = document.querySelector(".vignette");
    if (v) {
      const cs = getComputedStyle(v);
      out.vignette = {
        present: true,
        opacity: cs.opacity,
        position: cs.position,
        zIndex: cs.zIndex,
        background: cs.background.slice(0, 200),
        rectW: Math.round(v.getBoundingClientRect().width),
        rectH: Math.round(v.getBoundingClientRect().height),
      };
    } else out.vignette = { present: false };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      const r = canvas.getBoundingClientRect();
      out.canvas = {
        present: true,
        rectX: Math.round(r.x),
        rectY: Math.round(r.y),
        rectW: Math.round(r.width),
        rectH: Math.round(r.height),
        clientW: canvas.clientWidth,
        clientH: canvas.clientHeight,
        drawW: canvas.width,
        drawH: canvas.height,
      };
      // We can't read WebGL backbuffer directly; use page screenshot for pixel
      // colors instead in calling code.
    } else out.canvas = { present: false };

    out.bodyBg = getComputedStyle(document.body).backgroundColor;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    out.city = (window).__city || null;
    return out;
  });
}

async function visit() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE ERR:", msg.text());
  });
  console.log(`\n=== /platform ===`);
  await page.goto(`${BASE}/platform`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const totalScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  console.log(`scroll range = ${totalScroll}`);

  for (let i = 0; i < POSITIONS.length; i++) {
    const p = POSITIONS[i];
    const y = Math.round(totalScroll * p);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await page.waitForTimeout(700);
    const data = await sample(page);
    console.log(`\n--- pos ${p} (y=${y}) ---`);
    console.log(JSON.stringify(data, null, 2));
    const file = path.join(OUT, `city-${TAG}-${i}-p${Math.round(p * 100)}.png`);
    await page.screenshot({ path: file, fullPage: false });

    // Sample 5 pixels from the screenshot via a tiny offscreen image read.
    const pixels = await page.evaluate(async (file) => {
      // sample 5 viewport points by drawing nothing — use html2canvas? skip.
      // We rely on screenshot inspection instead.
      void file;
      return null;
    }, file);
    void pixels;
    console.log(`screenshot -> ${file}`);
  }

  await browser.close();
}

visit().catch((e) => { console.error(e); process.exit(1); });
