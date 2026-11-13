"use client";

import { whatsappLink, type Contact, type Content, type Lang } from "@/data/content";
import SiteFrame from "./SiteFrame";
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
  const c = content[lang];

  return (
    <SiteFrame content={content} contact={contact} lang={lang}>
      <main className="site-page-main">
        <SleekProject lang={lang} standalone />
        <LeadForm
          c={c}
          lang={lang}
          contact={contact}
          whatsapp={whatsappLink(contact, lang)}
          phoneHref={contact.phoneHref}
          defaultProject={c.leadForm.projectOptions.find((option) => /sleek/i.test(option))}
        />
      </main>
    </SiteFrame>
  );
}
