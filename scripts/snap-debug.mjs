import { chromium } from "@playwright/test";
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 2000, height: 1080 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  if (!h1) return null;
  const kids = [...h1.children].map((c, i) => {
    const cs = getComputedStyle(c);
    const r = c.getBoundingClientRect();
    return {
      idx: i,
      tag: c.tagName,
      text: c.innerText.slice(0, 40),
      display: cs.display,
      position: cs.position,
      visibility: cs.visibility,
      opacity: cs.opacity,
      color: cs.color,
      fontSize: cs.fontSize,
      rectX: Math.round(r.x),
      rectY: Math.round(r.y),
      rectW: Math.round(r.width),
      rectH: Math.round(r.height),
    };
  });
  // Drill into the rotating word's children too
  const rw = h1.children[0];
  const rwKids = rw ? [...rw.children].map((c, i) => {
    const cs = getComputedStyle(c);
    const r = c.getBoundingClientRect();
    return {
      idx: i, tag: c.tagName, cls: c.className?.slice(0, 60), text: c.innerText.slice(0,30),
      display: cs.display, position: cs.position, visibility: cs.visibility,
      opacity: cs.opacity, color: cs.color, fontSize: cs.fontSize,
      transform: cs.transform.slice(0, 60), filter: cs.filter.slice(0, 60),
      rectX: Math.round(r.x), rectY: Math.round(r.y), rectW: Math.round(r.width), rectH: Math.round(r.height),
    };
  }) : null;
  return { kids, rwKids, prefersReduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
