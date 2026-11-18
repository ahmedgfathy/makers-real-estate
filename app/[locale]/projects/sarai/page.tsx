import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SiteFrame from "@/components/SiteFrame";
import ProjectDetail from "@/components/portal/ProjectDetail";
import { whatsappLink } from "@/data/content";
import { PORTAL, PROJECT_DETAILS, projectsOf } from "@/data/portfolio";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";
import { getSite } from "@/lib/content-db";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const SLUG = "sarai";

const projectCopy = {
  en: {
    title: "Sarai Compound | S-Villa 212 | Madinet Masr | Makers Real Estate",
    description:
      "Explore Sarai Compound and S-Villa 212, view its listed facilities and project media, and enquire about pricing by unit size.",
  },
  ar: {
    title: "مشروع سراي | S-Villa 212 | مدينة مصر",
    description:
      "استكشف مشروع سراي وS-Villa 212 ومرافقه، وشاهد الصور واستفسر عن الأسعار حسب مساحة الوحدة.",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = projectCopy[locale];
  const url = absoluteUrl(`/${locale}/projects/${SLUG}`);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url, languages: localizedAlternates(`/projects/${SLUG}`) },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      url,
      images: ["/sarai/cover.jpg"],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: ["/sarai/cover.jpg"] },
  };
}

export default async function SaraiPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();

  const project = projectsOf(locale).find((item) => item.slug === SLUG);
  const detail = PROJECT_DETAILS[SLUG];
  if (!project || !detail) notFound();

  const { content, contact } = await getSite();
  const c = content[locale];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name: "Sarai",
          description: "S-Villa 212 at Sarai Compound",
          url: absoluteUrl(`/${locale}/projects/${SLUG}`),
          image: absoluteUrl("/sarai/cover.jpg"),
          provider: { "@type": "Organization", name: "Madinet Masr" },
          inLanguage: locale === "ar" ? "ar-EG" : "en-EG",
        }}
      />
      <SiteFrame content={content} contact={contact} lang={locale}>
        <main className="site-page-main">
          <ProjectDetail
            lang={locale}
            project={project}
            detail={detail}
            copy={PORTAL[locale]}
            contact={contact}
            whatsapp={whatsappLink(contact, locale)}
          />
          <LeadForm
            c={c}
            lang={locale}
            contact={contact}
            whatsapp={whatsappLink(contact, locale)}
            phoneHref={contact.phoneHref}
            defaultProject={c.leadForm.projectOptions.find((option) => /s-villa|sarai/i.test(option))}
          />
        </main>
      </SiteFrame>
    </>
  );
}
