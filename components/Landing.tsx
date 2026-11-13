"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import SleekProject from "./SleekProject";
import LeadForm from "./LeadForm";
import Footer from "./Footer";

export default function Landing({
  content,
  contact,
  initialLang,
}: {
  content: Record<Lang, Content>;
  contact: Contact;
  initialLang: Lang;
}) {
  const router = useRouter();
  const lang = initialLang;

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const changeLang = useCallback((next: Lang) => {
    if (next === lang) return;
    capture("language_switched", { language: next });
    router.push(`/${next}`);
  }, [lang, router]);

  return (
    <div className="site" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header
        c={c}
        lang={lang}
        onLang={changeLang}
        homeHref={`/${lang}`}
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
        <SleekProject lang={lang} />
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
        homeHref={`/${lang}`}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
      />
    </div>
  );
}
