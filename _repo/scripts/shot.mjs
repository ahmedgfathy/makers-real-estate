import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:3001";
const out = "/home/xinreal/makers/_src/shots/";
const errors = [];

const browser = await chromium.launch({
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE " + m.text().slice(0, 160)); });
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message.slice(0, 200)));

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.screenshot({ path: out + "01-hero.png" });

await page.evaluate(() => document.querySelector("#collection")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(2000);
await page.screenshot({ path: out + "02-collection.png" });

await page.locator("button.tile").nth(1).hover();
await page.waitForTimeout(900);
await page.screenshot({ path: out + "03-tile-hover.png" });

await page.locator("button.tile").nth(1).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: out + "04-panel.png" });

const modalInfo = await page.evaluate(() => {
  const s = document.querySelector(".panel-scroll");
  return s ? { scrollH: s.scrollHeight, clientH: s.clientHeight } : null;
});

await page.evaluate(() => { const el = document.querySelector(".panel-scroll"); if (el) el.scrollTop = 620; });
await page.waitForTimeout(800);
await page.screenshot({ path: out + "05-panel-scroll.png" });

await page.keyboard.press("Escape");
await page.waitForTimeout(700);

await page.locator("button.lang-opt").nth(1).click();
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(900);
await page.screenshot({ path: out + "06-ar-hero.png" });

await page.evaluate(() => document.querySelector("#collection")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: out + "07-ar-collection.png" });

await page.locator("button.tile").nth(0).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: out + "08-ar-panel.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.waitForTimeout(2500);
await mobile.screenshot({ path: out + "09-mobile-hero.png" });
await mobile.evaluate(() => document.querySelector("#collection")?.scrollIntoView({ block: "start" }));
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: out + "10-mobile-collection.png" });
await mobile.locator("button.tile").nth(0).click();
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: out + "11-mobile-panel.png" });

const basics = await page.evaluate(() => {
  const v = document.querySelector("video");
  return {
    video: v ? { readyState: v.readyState, paused: v.paused, w: v.videoWidth } : null,
    tiles: document.querySelectorAll("button.tile").length,
    dir: document.documentElement.dir,
  };
});

console.log("BASICS " + JSON.stringify(basics));
console.log("MODAL " + JSON.stringify(modalInfo));
console.log("ERRORS " + JSON.stringify(errors.slice(0, 6)));
await browser.close();