import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeLocationSection from "@/components/catalog/HomeLocationSection";
import { ProjectCards } from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SiteFrame from "@/components/SiteFrame";
import DeveloperSection from "@/components/portal/DeveloperSection";
import HeroSearch from "@/components/portal/HeroSearch";
import JourneySection from "@/components/portal/JourneySection";
import { whatsappLink } from "@/data/content";
import { PORTAL } from "@/data/portfolio";
import { listDirectoryLocations, listProjects } from "@/lib/catalog";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates, SITE_URL } from "@/lib/seo";

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

  const [{ content, contact }, locations, projects] = await Promise.all([
    getSite(),
    listDirectoryLocations(),
    listProjects({ pageSize: 6 }),
  ]);
  const c = content[locale];
  const copy = PORTAL[locale];

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
      <SiteFrame content={content} contact={contact} lang={locale}>
        <main>
          <HeroSearch lang={locale} copy={copy} areas={locations} image="/img/lakes-sunset.jpg" />

          <HomeLocationSection lang={locale} locations={locations} />

          <section className="psec" id="projects" aria-labelledby="projects-title">
            <div className="pwrap">
              <div className="phead">
                <div>
                  <p className="pkicker">{copy.projectsKicker}</p>
                  <h2 className="ptitle" id="projects-title">
                    {copy.projectsTitle}
                  </h2>
                  <p className="plede">{copy.projectsLede}</p>
                </div>
                <a className="pmore" href={`/${locale}/projects`}>
                  {copy.viewMore}
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              <ProjectCards lang={locale} projects={projects.items} />
            </div>
          </section>

          <JourneySection lang={locale} c={c} copy={copy} />

          <DeveloperSection lang={locale} copy={copy} />

          <LeadForm
            c={c}
            lang={locale}
            contact={contact}
            whatsapp={whatsappLink(contact, locale)}
            phoneHref={contact.phoneHref}
          />
        </main>
      </SiteFrame>
    </>
  );
}
