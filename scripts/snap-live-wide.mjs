import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 2000, height: 1080 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('https://sackettkavuru2028.vercel.app/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: '/tmp/snaps/live2k-hero.png' });
// snap at multiple jet positions
for (const [tag, y] of [['marquee', 1700], ['ticket', 2400], ['midway', 2000]]) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `/tmp/snaps/live2k-${tag}.png` });
}
await browser.close();
