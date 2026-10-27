import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:3001";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on("console", (m) => logs.push(m.type() + ": " + m.text().slice(0, 240)));
page.on("pageerror", (e) => logs.push("PAGEERROR: " + (e.stack || e.message).slice(0, 400)));
page.on("requestfailed", (r) => logs.push("REQFAIL: " + r.url().slice(0, 100) + " " + r.failure()?.errorText));
page.on("response", (r) => { if (r.status() >= 400) logs.push("HTTP" + r.status() + ": " + r.url().slice(0, 100)); });

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const info = await page.evaluate(() => {
  const reveals = [...document.querySelectorAll(".reveal")];
  const heroTitle = document.querySelector(".hero-title");
  return {
    reveals: reveals.length,
    isIn: reveals.filter((r) => r.classList.contains("is-in")).length,
    rect: heroTitle ? JSON.stringify(heroTitle.getBoundingClientRect()) : null,
    lang: document.documentElement.lang,
    fiber: !!(document.querySelector("body") && Object.keys(document.querySelector("body")).some((k) => k.startsWith("__reactFiber"))),
  };
});

let interaction = "unknown";
try {
  await page.locator("button.lang-opt").nth(1).click({ timeout: 4000 });
  await page.waitForTimeout(900);
  interaction = await page.evaluate(() => document.documentElement.lang + "/" + document.documentElement.dir);
} catch (e) {
  interaction = "FAIL " + e.message.slice(0, 100);
}

console.log("INFO " + JSON.stringify(info));
console.log("INTERACTION " + interaction);
console.log("LOGS " + JSON.stringify(logs.slice(0, 10), null, 1));
await browser.close();