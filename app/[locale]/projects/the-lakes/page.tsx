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

const SLUG = "the-lakes";

const pageCopy = {
  en: {
    title: "The Lakes, SODIC East | Prices and Payment Plan | Makers Real Estate",
    description:
      "The Lakes in SODIC East, New Heliopolis: apartments, duplexes and penthouses from 60 to 209 m², with the developer's 0% down and ten-year payment plan.",
  },
  ar: {
    title: "البحيرات سوديك إيست | الأسعار وخطة السداد | ميكرز للعقارات",
    description:
      "البحيرات في سوديك إيست بهليوبوليس الجديدة: شقق ودوبلكس وبنتهاوس بمساحات 60 إلى 209 م²، بخطة سداد من المطور بمقدم 0% وتقسيط عشر سنوات.",
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
      images: ["/img/lakes-pool.jpg"],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  };
}

export default async function TheLakesPage({ params }: PageProps) {
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
          name: "The Lakes",
          description: "Residential project at SODIC East, New Heliopolis",
          url: absoluteUrl(`/${locale}/projects/${SLUG}`),
          image: absoluteUrl("/img/lakes-pool.jpg"),
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
            defaultProject={c.leadForm.projectOptions.find((option) => /the lakes|البحيرات/i.test(option))}
          />
        </main>
      </SiteFrame>
    </>
  );
}
