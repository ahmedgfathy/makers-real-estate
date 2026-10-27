import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3011", { waitUntil: "domcontentloaded" }).catch(() => {});
const test = (url) =>
  page.evaluate((u) => new Promise((res) => {
    try {
      const ws = new WebSocket(u);
      const t = setTimeout(() => res("timeout"), 4000);
      ws.onopen = () => { clearTimeout(t); res("open"); };
      ws.onerror = () => { clearTimeout(t); res("error"); };
    } catch (e) { res("throw:" + e.message); }
  }), url);
console.log("127.0.0.1 ->", await test("ws://127.0.0.1:3011/_next/hmr?id=p1"));
console.log("10.255.255.254 ->", await test("ws://10.255.255.254:3011/_next/hmr?id=p2"));
console.log("localhost ->", await test("ws://localhost:3011/_next/hmr?id=p3"));
await browser.close();