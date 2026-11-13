import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Landing from "@/components/Landing";
import { absoluteUrl, isLang, localizedAlternates, SITE_URL } from "@/lib/seo";
import { getSite } from "@/lib/content-db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const { content } = await getSite();
  const meta = content[locale].meta;
  const url = absoluteUrl(`/${locale}`);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: localizedAlternates(),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url,
      locale: locale === "ar" ? "ar_EG" : "en_EG",
      alternateLocale: locale === "ar" ? "en_EG" : "ar_EG",
      images: ["/img/lakes-pool.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/img/lakes-pool.jpg"],
    },
  };
}

export default async function LocalizedHome({ params }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();

  const { content, contact } = await getSite();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Makers Real Estate",
              url: SITE_URL,
              logo: absoluteUrl("/img/makers-logo-black.png"),
            },
            {
              "@type": "WebSite",
              name: "Makers Real Estate",
              url: SITE_URL,
              inLanguage: locale === "ar" ? "ar-EG" : "en-EG",
            },
          ],
        }}
      />
      <Landing content={content} contact={contact} initialLang={locale} />
    </>
  );
}
