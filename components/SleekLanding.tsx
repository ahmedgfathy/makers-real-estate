"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { whatsappLink, type Contact, type Content, type Lang } from "@/data/content";
import { capture } from "@/lib/analytics";
import Footer from "./Footer";
import Header from "./Header";
import LeadForm from "./LeadForm";
import SleekProject from "./SleekProject";

export default function SleekLanding({
  content,
  contact,
  lang,
}: {
  content: Record<Lang, Content>;
  contact: Contact;
  lang: Lang;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const changeLang = useCallback((next: Lang) => {
    if (next === lang) return;
    capture("language_switched", { language: next });
    const localizedPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${next}`);
    router.push(localizedPath);
  }, [lang, pathname, router]);

  return (
    <div className="site" id="top" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
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
        <SleekProject lang={lang} standalone />
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
