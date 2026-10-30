import { chromium } from "playwright";
const out = "/home/xinreal/makers/preview/";
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message.slice(0, 160)));
await page.goto("http://127.0.0.1:3001", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const vid = await page.evaluate(() => {
  const v = document.querySelector("video");
  return v ? { src: v.currentSrc, readyState: v.readyState, paused: v.paused, w: v.videoWidth, h: v.videoHeight, t: v.currentTime } : null;
});
await page.screenshot({ path: out + "sync-hero.png" });
await page.evaluate(() => document.querySelector("#collection")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1800);
await page.screenshot({ path: out + "sync-collection.png" });
console.log("VIDEO " + JSON.stringify(vid));
console.log("ERRORS " + JSON.stringify(errs));
await browser.close();