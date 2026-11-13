"use client";

import type { Contact, Content, Lang } from "@/data/content";
import SiteFrame from "./SiteFrame";
import ProjectCarousel from "./ProjectCarousel";

export default function Landing({
  content,
  contact,
  initialLang,
}: {
  content: Record<Lang, Content>;
  contact: Contact;
  initialLang: Lang;
}) {
  return (
    <SiteFrame content={content} contact={contact} lang={initialLang}>
      <main className="landing-main">
        <ProjectCarousel projects={content[initialLang].sections.projects.items} lang={initialLang} />
      </main>
    </SiteFrame>
  );
}
