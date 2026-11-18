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

const SLUG = "eastvale";

const pageCopy = {
  en: {
    title: "EastVale, Mada City | Prices and Payment Plan | Makers Real Estate",
    description:
      "EastVale in Mada City, Mostakbal City: SODIC's 500-feddan community with apartments, townhouses and villas from 80 to 311 m², 5% down and up to nine years.",
  },
  ar: {
    title: "إيست فيل مدينة مادا | الأسعار وخطة السداد | ميكرز للعقارات",
    description:
      "إيست فيل في مدينة مادا بمدينة المستقبل: مجتمع سوديك على 500 فدان بشقق وتاون هاوس وفلل من 80 إلى 311 م²، بمقدم 5% وتقسيط حتى تسع سنوات.",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = pageCopy[locale];
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
      images: ["/img/lakes-sunset.jpg"],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  };
}

export default async function EastValePage({ params }: PageProps) {
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
          name: "EastVale",
          description: "Residential project inside Mada City, Mostakbal City",
          url: absoluteUrl(`/${locale}/projects/${SLUG}`),
          image: absoluteUrl("/img/lakes-sunset.jpg"),
          provider: { "@type": "Organization", name: "SODIC" },
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
            defaultProject={c.leadForm.projectOptions.find((option) => /eastvale|إيست فيل/i.test(option))}
          />
        </main>
      </SiteFrame>
    </>
  );
}
