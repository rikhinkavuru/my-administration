import { chromium } from "@playwright/test";
const sizes = [{w:1440,h:900,t:'sm'},{w:1920,h:1080,t:'md'},{w:2560,h:1440,t:'lg'}];
const browser = await chromium.launch({ headless: true });
for (const {w,h,t} of sizes) {
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/', { waitUntil:'networkidle' });
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const sec = document.querySelector('section');
    const r = sec?.getBoundingClientRect();
    return { sectionHeight: r ? Math.round(r.height) : null, vh: window.innerHeight };
  });
  console.log(`${t} viewport=${w}x${h} section=${info.sectionHeight}px vh=${info.vh}`);
  await page.screenshot({ path: `/tmp/snaps/hero-${t}.png` });
  await ctx.close();
}
await browser.close();
