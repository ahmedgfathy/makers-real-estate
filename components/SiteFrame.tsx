"use client";

import { useCallback, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type Contact, type Content, type Lang, whatsappLink } from "@/data/content";
import { capture } from "@/lib/analytics";
import { ui } from "@/lib/labels";
import FloatingActions from "./portal/FloatingActions";
import Footer from "./Footer";
import Header from "./Header";

export default function SiteFrame({
  content,
  contact,
  lang,
  children,
}: {
  content: Record<Lang, Content>;
  contact: Contact;
  lang: Lang;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const localeRoot = `/${lang}`;
  const c = content[lang];
  const labels = ui[lang];
  const whatsapp = whatsappLink(contact, lang);

  const changeLang = useCallback((next: Lang) => {
    if (next === lang) return;
    capture("language_switched", { language: next });
    const localizedPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${next}`);
    router.push(localizedPath);
  }, [lang, pathname, router]);

  return (
    <div className="site" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header
        c={c}
        lang={lang}
        onLang={changeLang}
        localeRoot={localeRoot}
        contact={contact}
        phoneHref={contact.phoneHref}
      />
      {children}
      <FloatingActions
        phoneHref={contact.phoneHref}
        whatsapp={whatsapp}
        callLabel={labels.call}
        whatsappLabel={labels.whatsapp}
      />
      <Footer
        c={c}
        contact={contact}
        lang={lang}
        localeRoot={localeRoot}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
      />
    </div>
  );
}
