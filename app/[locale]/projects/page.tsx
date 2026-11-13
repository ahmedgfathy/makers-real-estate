import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectsCatalog from "@/components/ProjectsCatalog";
import SiteFrame from "@/components/SiteFrame";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";
import { getSite } from "@/lib/content-db";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const pageCopy = {
  en: {
    title: "Property Projects in Egypt | Makers Real Estate",
    description: "Explore current residential and commercial real estate projects represented by Makers Real Estate.",
  },
  ar: {
    title: "مشروعات عقارية في مصر | ميكرز للعقارات",
    description: "استكشف المشروعات العقارية السكنية والتجارية المتاحة من خلال ميكرز للعقارات.",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = pageCopy[locale];
  const url = absoluteUrl(`/${locale}/projects`);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url, languages: localizedAlternates("/projects") },
    openGraph: { title: copy.title, description: copy.description, type: "website", url },
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();

  const { content, contact } = await getSite();
  return (
    <SiteFrame content={content} contact={contact} lang={locale}>
      <main className="site-page-main">
        <ProjectsCatalog c={content[locale]} lang={locale} />
      </main>
    </SiteFrame>
  );
}
