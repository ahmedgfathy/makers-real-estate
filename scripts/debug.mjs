import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const logs = [];
page.on("console", (m) => logs.push(m.type() + ": " + m.text().slice(0, 200)));
page.on("pageerror", (e) => logs.push("PAGEERROR: " + e.message.slice(0, 300)));
page.on("requestfailed", (r) => logs.push("REQFAIL: " + r.url().slice(0, 120) + " " + r.failure()?.errorText));
page.on("response", (r) => { if (r.status() >= 400) logs.push("HTTP" + r.status() + ": " + r.url().slice(0, 120)); });

await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const info = await page.evaluate(() => {
  const reveals = [...document.querySelectorAll(".reveal")];
  return {
    revealCount: reveals.length,
    isIn: reveals.filter((r) => r.classList.contains("is-in")).length,
    firstOpacity: reveals[0] ? getComputedStyle(reveals[0]).opacity : null,
    title: document.querySelector(".hero-title")?.textContent,
    tiles: document.querySelectorAll("button.tile").length,
    hasNextData: !!window.__NEXT_DATA__ || !!document.querySelector("script[src*='_next']"),
    scripts: [...document.querySelectorAll("script[src]")].map((s) => s.src).slice(0, 6),
    reactRoot: Object.keys(document.querySelector("body")).length,
  };
});

// try clicking the language toggle to test interactivity
let langWorks = null;
try {
  await page.locator("button.lang-opt").nth(1).click({ timeout: 3000 });
  await page.waitForTimeout(800);
  langWorks = await page.evaluate(() => document.documentElement.lang);
} catch (e) {
  langWorks = "CLICK_FAILED " + e.message.slice(0, 120);
}

console.log("INFO " + JSON.stringify(info, null, 1));
console.log("LANG " + langWorks);
console.log("LOGS " + JSON.stringify(logs.slice(0, 12), null, 1));
await browser.close();