import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 2000, height: 1080 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const meta = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  return { h1Text: h1?.innerText?.slice(0,80), h1Height: h1 ? Math.round(h1.getBoundingClientRect().height) : null };
});
console.log('LOCAL 2K:', JSON.stringify(meta));
await page.screenshot({ path: '/tmp/snaps/local2k-hero.png' });
await page.evaluate(() => window.scrollTo({ top: 1700, behavior: 'instant' }));
await page.waitForTimeout(1200);
await page.screenshot({ path: '/tmp/snaps/local2k-marquee.png' });
await browser.close();
