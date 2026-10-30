import { chromium } from "playwright";

const base = "http://127.0.0.1:3001";
const out = "/home/xinreal/makers/_src/shots/";
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// English: scroll to footer
await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1500);
await page.screenshot({ path: out + "12-footer-en.png" });

// Arabic
await page.locator("button.lang-opt").nth(1).click();
await page.waitForTimeout(1600);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);

await page.evaluate(() => document.querySelector("#collection")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1200);
await page.locator("button.tile").nth(0).screenshot({ path: out + "13-ar-tile-zoom.png" });
await page.locator("button.tile").nth(1).screenshot({ path: out + "14-ar-tile2-zoom.png" });

// Arabic panel with the units table
await page.locator("button.tile").nth(1).click();
await page.waitForTimeout(1500);
await page.evaluate(() => { const el = document.querySelector(".panel-scroll"); if (el) el.scrollTop = 340; });
await page.waitForTimeout(700);
await page.screenshot({ path: out + "15-ar-panel-table.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1300);
await page.screenshot({ path: out + "16-footer-ar.png" });

// mobile collection
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.waitForTimeout(1800);
await mobile.evaluate(() => document.querySelector("#collection")?.scrollIntoView({ block: "start" }));
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: out + "17-mobile-collection.png" });
await mobile.evaluate(() => document.querySelector("#contact")?.scrollIntoView({ block: "start" }));
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: out + "18-mobile-footer.png" });

console.log("done");
await browser.close();