"use client";

import { useCallback, useEffect, useState } from "react";
import {
  whatsappLink,
  type Contact,
  type Content,
  type Lang,
} from "@/data/content";
import { capture } from "@/lib/analytics";
import Header from "./Header";
import Hero from "./Hero";
import Showcase from "./Showcase";
import LeadForm from "./LeadForm";
import Footer from "./Footer";

export default function Landing({
  content,
  contact,
}: {
  content: Record<Lang, Content>;
  contact: Contact;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("makers.lang");
      if (stored === "ar" || stored === "en") setLang(stored);
    } catch {
      /* storage unavailable */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    // Do not write back before the stored choice has been read: in React
    // StrictMode the first effect pass would otherwise overwrite it with "en".
    if (!hydrated) return;
    try {
      window.localStorage.setItem("makers.lang", lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang, hydrated]);

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    capture("language_switched", { language: next });
  }, []);

  return (
    <div className="site">
      <Header
        c={c}
        lang={lang}
        onLang={changeLang}
        contact={contact}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
      />

      <main>
        <Hero
          c={c}
          lang={lang}
          contact={contact}
          whatsapp={whatsapp}
          phoneHref={contact.phoneHref}
        />
        <Showcase c={c} lang={lang} />
        <LeadForm
          c={c}
          lang={lang}
          contact={contact}
          whatsapp={whatsapp}
          phoneHref={contact.phoneHref}
        />
      </main>

      <Footer
        c={c}
        contact={contact}
        lang={lang}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
      />
    </div>
  );
}
