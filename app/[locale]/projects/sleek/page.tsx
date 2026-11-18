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

const SLUG = "sleek";

const pageCopy = {
  en: {
    title: "Sleek South 90th Street | Commercial Units in New Cairo",
    description:
      "Explore Sleek, AlRabat's retail, F&B, administrative and clinic destination on South 90th Street at Mohamed Naguib Axis. View starting prices, payment terms and delivery details.",
  },
  ar: {
    title: "سليك شارع التسعين الجنوبي | وحدات تجارية في القاهرة الجديدة",
    description:
      "اكتشف مشروع سليك من الرباط للتجزئة والمطاعم والمكاتب والعيادات في شارع التسعين الجنوبي عند محور محمد نجيب. تعرّف على الأسعار وخطة السداد وموعد التسليم.",
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
      locale: locale === "ar" ? "ar_EG" : "en_EG",
      alternateLocale: locale === "ar" ? "en_EG" : "ar_EG",
      images: ["/sleek/exterior.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: ["/sleek/exterior.jpg"],
    },
  };
}

export default async function SleekProjectPage({ params }: PageProps) {
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
          "@graph": [
            {
              "@type": "Organization",
              name: "Makers Real Estate",
              url: absoluteUrl("/"),
              logo: absoluteUrl("/img/makers-logo-black.png"),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: absoluteUrl(`/${locale}`) },
                { "@type": "ListItem", position: 2, name: "Sleek", item: absoluteUrl(`/${locale}/projects/${SLUG}`) },
              ],
            },
            {
              "@type": "Place",
              name: "Sleek",
              description: "Commercial destination on South 90th Street, New Cairo",
              url: absoluteUrl(`/${locale}/projects/${SLUG}`),
              image: absoluteUrl("/sleek/exterior.jpg"),
              provider: { "@type": "Organization", name: "AlRabat" },
              inLanguage: locale === "ar" ? "ar-EG" : "en-EG",
            },
          ],
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
            defaultProject={c.leadForm.projectOptions.find((option) => /sleek/i.test(option))}
          />
        </main>
      </SiteFrame>
    </>
  );
}
