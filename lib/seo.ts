import type { Lang } from "@/data/content";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersegypt.com";

export function isLang(value: string): value is Lang {
  return value === "en" || value === "ar";
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function localePath(lang: Lang, path = ""): string {
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `/${lang}${suffix}`;
}

export function localizedAlternates(path = ""): Record<string, string> {
  const englishPath = localePath("en", path);
  const arabicPath = localePath("ar", path);

  return {
    en: absoluteUrl(englishPath),
    ar: absoluteUrl(arabicPath),
    "x-default": absoluteUrl(englishPath),
  };
}
