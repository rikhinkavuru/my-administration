import { chromium } from "@playwright/test";
const URL = process.env.URL || "https://sackettkavuru2028.vercel.app/";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('PAGE ERROR:', e.message));
page.on('console', msg => { if (msg.type()==='error') console.log('CONSOLE ERR:', msg.text().slice(0,200)); });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const meta = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const rotating = document.querySelector('h1 .text-\\[var\\(--accent-red\\)\\]');
  const canvases = [...document.querySelectorAll('canvas')];
  return {
    h1Text: h1?.innerText?.slice(0,80),
    h1Rect: h1 ? h1.getBoundingClientRect() : null,
    rotatingText: rotating?.innerText?.slice(0,40),
    canvasCount: canvases.length,
  };
});
console.log('HERO META:', JSON.stringify(meta, null, 2));
await page.screenshot({ path: '/tmp/snaps/live-hero.png' });
// scroll into jet area
await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
await page.waitForTimeout(1200);
const jetMeta = await page.evaluate(() => ({
  canvasCount: document.querySelectorAll('canvas').length,
  jetCanvasParent: (() => {
    const c = document.querySelector('canvas'); if (!c) return null;
    return { z: getComputedStyle(c.parentElement).zIndex, pe: getComputedStyle(c.parentElement).pointerEvents };
  })(),
}));
console.log('JET AREA META:', JSON.stringify(jetMeta, null, 2));
await page.screenshot({ path: '/tmp/snaps/live-jet.png' });
await browser.close();
