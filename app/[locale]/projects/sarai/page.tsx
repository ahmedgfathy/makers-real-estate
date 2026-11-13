import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SiteFrame from "@/components/SiteFrame";
import SaraiProject from "@/components/SaraiProject";
import { whatsappLink } from "@/data/content";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";
import { getSite } from "@/lib/content-db";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const projectCopy = {
  en: {
    title: "Sarai Compound | S-Villa 212 | Madinet Masr | Makers Real Estate",
    description: "Explore Sarai Compound and S-Villa 212, view its listed facilities and project media, and enquire about pricing by unit size.",
  },
  ar: {
    title: "مشروع سراي | S-Villa 212 | مدينة مصر",
    description: "استكشف مشروع سراي وS-Villa 212 ومرافقه، وشاهد الصور واستفسر عن الأسعار حسب مساحة الوحدة.",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = projectCopy[locale];
  const url = absoluteUrl(`/${locale}/projects/sarai`);
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: url,
      languages: localizedAlternates("/projects/sarai"),
    },
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

  const { content, contact } = await getSite();
  const c = content[locale];
  const projectUrl = absoluteUrl(`/${locale}/projects/sarai`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name: "Sarai",
          description: "S-Villa 212 at Sarai Compound",
          url: projectUrl,
          image: absoluteUrl("/sarai/cover.jpg"),
          provider: { "@type": "Organization", name: "Madinet Masr" },
          inLanguage: locale === "ar" ? "ar-EG" : "en-EG",
        }}
      />
      <SiteFrame content={content} contact={contact} lang={locale}>
        <main className="site-page-main">
          <SaraiProject lang={locale} />
          <LeadForm
            c={c}
            lang={locale}
            contact={contact}
            whatsapp={whatsappLink(contact, locale)}
            phoneHref={contact.phoneHref}
            defaultProject={c.leadForm.projectOptions.find((option) => /s-villa/i.test(option))}
          />
        </main>
      </SiteFrame>
    </>
  );
}
