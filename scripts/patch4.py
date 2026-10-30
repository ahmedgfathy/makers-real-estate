# -*- coding: utf-8 -*-
import io

root = "/home/xinreal/makers/"
miss = []

def patch(path, old, new):
    p = root + path
    s = io.open(p, encoding="utf-8").read()
    if old not in s:
        miss.append((path, old[:70]))
        return
    s = s.replace(old, new, 1)
    io.open(p, "w", encoding="utf-8").write(s)

helper = '''const LRI = "\\u2066";
const PDI = "\\u2069";
const NUM_CHUNK = /[A-Za-z0-9][A-Za-z0-9,.\\/\\u2013\\-+%]*(?:\\s*[\\u2013\\-]\\s*[A-Za-z0-9][A-Za-z0-9,.\\/\\u2013\\-+%]*)*/g;
const SKIP_KEYS = new Set(["id", "src", "image", "kind"]);

const isolateText = (s: string) =>
  /^\\//.test(s) || /^(https?:|tel:|mailto:)/.test(s) ? s : s.replace(NUM_CHUNK, (m) => LRI + m + PDI);

function isolateDeep<T>(value: T, key?: string): T {
  if (typeof value === "string") {
    return (SKIP_KEYS.has(key ?? "") ? value : isolateText(value)) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => isolateDeep(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = isolateDeep(v, k);
    }
    return out as T;
  }
  return value;
}

export const content: Record<Lang, Content> = { en, ar: isolateDeep(ar) };'''

patch("data/content.ts",
      "export const content: Record<Lang, Content> = { en, ar };",
      helper)

patch("app/site.css",
      "  filter: saturate(0.9) brightness(0.82);",
      "  filter: saturate(0.92) brightness(0.8) contrast(1.06);")

patch("app/globals.css",
      """  background:
    linear-gradient(180deg, rgba(8, 8, 10, 0.78) 0%, rgba(8, 8, 10, 0.16) 26%, rgba(8, 8, 10, 0.12) 48%, rgba(8, 8, 10, 0.72) 82%, var(--bg) 100%),
    radial-gradient(120% 90% at 15% 100%, rgba(8, 8, 10, 0.72) 0%, rgba(8, 8, 10, 0) 60%);""",
      """  background:
    linear-gradient(180deg, rgba(8, 8, 10, 0.74) 0%, rgba(8, 8, 10, 0.2) 22%, rgba(8, 8, 10, 0.12) 46%, rgba(8, 8, 10, 0.74) 82%, var(--bg) 100%),
    radial-gradient(120% 90% at 12% 100%, rgba(8, 8, 10, 0.72) 0%, rgba(8, 8, 10, 0) 58%),
    linear-gradient(96deg, rgba(8, 8, 10, 0.55) 0%, rgba(8, 8, 10, 0.14) 42%, rgba(8, 8, 10, 0) 72%);""")

print("MISSES:", len(miss))
for m in miss:
    print("  MISS", m)