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

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("makers.lang");
      if (stored === "ar" || stored === "en") setLang(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("makers.lang", lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    capture("language_switched", { language: next });
  }, []);

  return (
    <>
      <Header c={c} lang={lang} onLang={changeLang} whatsapp={whatsapp} phoneHref={contact.phoneHref} />

      <main>
        <Hero c={c} lang={lang} whatsapp={whatsapp} phoneHref={contact.phoneHref} />
        <LeadForm c={c} lang={lang} whatsapp={whatsapp} phoneHref={contact.phoneHref} />
      </main>

      <Footer
        c={c}
        contact={contact}
        lang={lang}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
      />
    </>
  );
}
