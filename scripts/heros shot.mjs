import { chromium } from "playwright";
const base = "http://127.0.0.1:3001";
const out = "/home/xinreal/makers/preview/";
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });

const shots = [
  { name: "hero-desktop.png", w: 1440, h: 900 },
  { name: "hero-wide.png", w: 1920, h: 1080 },
];
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: out + s.name });
  const m = await page.evaluate(() => {
    const f = document.querySelector(".hero-frame");
    const r = f?.getBoundingClientRect();
    const v = document.querySelector("video");
    return {
      frame: r ? { w: Math.round(r.width), h: Math.round(r.height), ratio: +(r.width / r.height).toFixed(2), top: Math.round(r.top) } : null,
      video: v ? { w: v.videoWidth, h: v.videoHeight, paused: v.paused } : null,
      scrollH: document.body.scrollHeight,
    };
  });
  console.log(s.name, JSON.stringify(m), "errors:", errs.length);
  await page.close();
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.waitForTimeout(3000);
await mobile.screenshot({ path: out + "hero-mobile.png" });
await mobile.close();

const ar = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await ar.goto(base, { waitUntil: "networkidle" });
await ar.waitForTimeout(1500);
await ar.locator("button.lang-opt").nth(1).click();
await ar.waitForTimeout(2000);
await ar.evaluate(() => window.scrollTo(0, 0));
await ar.waitForTimeout(800);
await ar.screenshot({ path: out + "hero-ar.png" });
console.log("done");
await browser.close();