import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('PAGE ERROR:', e.message));
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
for (const [tag, y] of [['hero', 0], ['after-hero', 1000], ['marquee', 1500], ['ticket', 2200], ['between', 1200]]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await page.waitForTimeout(900);
  const canvasInfo = await page.evaluate(() => {
    const canvases = [...document.querySelectorAll('canvas')];
    return canvases.map(c => ({
      x: Math.round(c.getBoundingClientRect().x),
      y: Math.round(c.getBoundingClientRect().y),
      w: Math.round(c.getBoundingClientRect().width),
      h: Math.round(c.getBoundingClientRect().height),
      parent_z: getComputedStyle(c.parentElement).zIndex,
      parent_pe: getComputedStyle(c.parentElement).pointerEvents,
    }));
  });
  console.log(`tag=${tag} y=${y} canvases=${JSON.stringify(canvasInfo)}`);
  await page.screenshot({ path: `/tmp/snaps/home-${tag}.png` });
}
await browser.close();
