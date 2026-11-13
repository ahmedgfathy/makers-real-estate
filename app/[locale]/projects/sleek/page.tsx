import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import SleekLanding from "@/components/SleekLanding";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";
import { getSite } from "@/lib/content-db";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const projectCopy = {
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

  const copy = projectCopy[locale];
  const url = absoluteUrl(`/${locale}/projects/sleek`);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: url,
      languages: localizedAlternates("/projects/sleek"),
    },
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

  const { content, contact } = await getSite();
  const homeUrl = absoluteUrl(`/${locale}`);
  const projectUrl = absoluteUrl(`/${locale}/projects/sleek`);

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
                {
                  "@type": "ListItem",
                  position: 1,
                  name: locale === "ar" ? "الرئيسية" : "Home",
                  item: homeUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Sleek",
                  item: projectUrl,
                },
              ],
            },
          ],
        }}
      />
      <SleekLanding content={content} contact={contact} lang={locale} />
    </>
  );
}
