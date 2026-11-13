import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeadForm from "@/components/LeadForm";
import SiteFrame from "@/components/SiteFrame";
import { whatsappLink } from "@/data/content";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";
import { getSite } from "@/lib/content-db";
import { ui } from "@/lib/labels";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const pageCopy = {
  en: {
    title: "Contact Makers Real Estate",
    description: "Contact the Makers Real Estate team about current property projects and availability.",
  },
  ar: {
    title: "تواصل مع ميكرز للعقارات",
    description: "تواصل مع فريق ميكرز للعقارات للاستفسار عن المشروعات والوحدات المتاحة.",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = pageCopy[locale];
  const url = absoluteUrl(`/${locale}/contact`);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url, languages: localizedAlternates("/contact") },
    openGraph: { title: copy.title, description: copy.description, type: "website", url },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();

  const { content, contact } = await getSite();
  const c = content[locale];

  return (
    <SiteFrame content={content} contact={contact} lang={locale}>
      <main className="site-page-main">
        <section className="section contact-page" aria-labelledby="contact-title">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <p className="section-kicker">{c.leadForm.kicker}</p>
                <h1 className="section-title" id="contact-title">{ui[locale].contactUs}</h1>
              </div>
              <p className="section-lede">{c.leadForm.lede}</p>
            </div>
            <LeadForm
              c={c}
              lang={locale}
              contact={contact}
              whatsapp={whatsappLink(contact, locale)}
              phoneHref={contact.phoneHref}
            />
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
