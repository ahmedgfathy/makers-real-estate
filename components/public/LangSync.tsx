"use client";

import { useEffect } from "react";
import type { Lang } from "@/data/content";

/**
 * Keeps <html lang/dir> in sync on the public catalogue pages, which read the
 * language from the query string instead of client state.
 */
export default function LangSync({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("makers.lang", lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  return null;
}
