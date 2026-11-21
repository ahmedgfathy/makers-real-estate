import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, LocationCards } from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import SiteFrame from "@/components/SiteFrame";
import { listDirectoryLocations } from "@/lib/catalog";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const copy = {
  en: {
    kicker: "Location guide",
    title: "Explore Properties by Location",
    lede: "Browse active areas and districts, see how many projects they contain and follow the hierarchy down to individual units.",
  },
  ar: {
    kicker: "دليل المواقع",
    title: "استكشف العقارات حسب الموقع",
    lede: "تصفح المناطق والأحياء النشطة، واعرف عدد المشروعات في كل منها، ثم انتقل عبر التسلسل وصولاً إلى الوحدات.",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};
  const text = copy[locale];
  const url = absoluteUrl(`/${locale}/locations`);
  return {
    title: text.title,
    description: text.lede,
    alternates: { canonical: url, languages: localizedAlternates("/locations") },
    openGraph: { title: text.title, description: text.lede, type: "website", url },
  };
}

export default async function LocationsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();
  const [site, locations] = await Promise.all([getSite(), listDirectoryLocations()]);
  const text = copy[locale];
  const url = absoluteUrl(`/${locale}/locations`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: text.title,
          url,
          numberOfItems: locations.length,
          itemListElement: locations.map((location, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: locale === "ar" ? location.nameAr : location.nameEn,
            url: absoluteUrl(`/${locale}/locations/${location.slug}`),
          })),
        }}
      />
      <SiteFrame content={site.content} contact={site.contact} lang={locale}>
        <main className="site-page-main">
          <header className="cat-page-head">
            <div className="pwrap">
              <Breadcrumbs
                lang={locale}
                items={[
                  { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
                  { label: text.title },
                ]}
              />
              <p className="pkicker">{text.kicker}</p>
              <h1 className="ptitle">{text.title}</h1>
              <p className="plede">{text.lede}</p>
            </div>
          </header>
          <section className="psec">
            <div className="pwrap">
              {locations.length ? <LocationCards lang={locale} locations={locations} /> : null}
            </div>
          </section>
        </main>
      </SiteFrame>
    </>
  );
}
