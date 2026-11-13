import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutContent from "@/components/AboutContent";
import SiteFrame from "@/components/SiteFrame";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";
import { getSite } from "@/lib/content-db";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const pageCopy = {
  en: {
    title: "About Makers Real Estate",
    description: "Learn about Makers Real Estate and how we help buyers explore primary property opportunities.",
  },
  ar: {
    title: "من نحن | ميكرز للعقارات",
    description: "تعرف على ميكرز للعقارات وكيف نساعد المشترين في استكشاف الفرص العقارية الأولية.",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = pageCopy[locale];
  const url = absoluteUrl(`/${locale}/about`);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url, languages: localizedAlternates("/about") },
    openGraph: { title: copy.title, description: copy.description, type: "website", url },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();

  const { content, contact } = await getSite();
  return (
    <SiteFrame content={content} contact={contact} lang={locale}>
      <main className="site-page-main">
        <AboutContent c={content[locale]} lang={locale} />
      </main>
    </SiteFrame>
  );
}
