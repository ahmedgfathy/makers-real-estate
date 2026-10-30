import type { Metadata } from "next";
import type { Lang } from "@/data/content";
import { whatsappLink } from "@/data/content";
import { getSite } from "@/lib/content-db";
import { egp, titleCase } from "@/lib/format";
import { listProperties } from "@/lib/admin";
import Arrow from "@/components/public/Arrow";
import LangSync from "@/components/public/LangSync";
import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Units — Makers Real Estate",
  description:
    "Individual units published by the Makers Real Estate sales team: type, area, finishing, price and payment plan.",
};

/**
 * Public unit catalogue.
 *
 * Only rows switched on with the CRM publish checkbox are listed — the query
 * filters on `published`, so an inventory draft never reaches the website.
 */

export default async function PublicPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === "ar" ? "ar" : "en";

  const [{ content, contact }, properties] = await Promise.all([
    getSite(),
    listProperties({ publishedOnly: true, limit: 200 }),
  ]);

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  const t =
    lang === "ar"
      ? {
          kicker: "الوحدات",
          title: "وحدات متاحة الآن",
          lede: "كل وحدة منشورة من فريق المبيعات: النوع، المساحة، التشطيب، السعر وخطة السداد.",
          count: "وحدة منشورة",
          view: "عرض الوحدة",
          empty: "لا توجد وحدات منشورة حاليًا. عد قريبًا.",
          monthly: "شهريًا",
          sold: "مباعة",
          reserved: "محجوزة",
          available: "متاحة",
          offPlan: "على الخريطة",
        }
      : {
          kicker: "Units",
          title: "Units available today",
          lede: "Every unit our sales team has published: type, area, finishing, price and payment plan.",
          count: "units live",
          view: "View unit",
          empty: "No units are published right now. Check back soon.",
          monthly: "/ mo",
          sold: "Sold",
          reserved: "Reserved",
          available: "Available",
          offPlan: "Off-plan",
        };

  const statusLabel = (status: string) =>
    status === "sold"
      ? t.sold
      : status === "reserved"
        ? t.reserved
        : status === "off_plan"
          ? t.offPlan
          : t.available;

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <LangSync lang={lang} />
      <PublicHeader
        c={c}
        lang={lang}
        basePath="/properties"
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
        active="properties"
      />

      <main className="public-main">
        <section className="collection">
          <div className="collection-inner">
            <div className="collection-head">
              <div>
                <h1 className="collection-lede">{t.title}</h1>
                <p className="public-sublede">{t.lede}</p>
              </div>
              <div className="collection-meta">
                <span className="eyebrow">{t.kicker}</span>
                <span className="collection-count">
                  {properties.length} {t.count}
                </span>
              </div>
            </div>

            {properties.length ? (
              <div className="tiles">
                {properties.map((property, index) => {
                  const cover = property.images[0] ?? "/img/lakes-pool.jpg";
                  const specs = [
                    titleCase(property.property_type),
                    property.bedrooms != null ? `${property.bedrooms} BD` : null,
                    property.built_up_area != null
                      ? `${new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(property.built_up_area)} m²`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <a
                      className="tile"
                      key={property.id}
                      href={`/properties/${property.id}?lang=${lang}`}
                      aria-label={`${t.view} — ${property.title}`}
                    >
                      <span className="tile-media">
                        <img
                          src={cover}
                          alt={property.title}
                          loading={index < 3 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </span>
                      <span className="tile-veil" />
                      <span className="tile-top">
                        <span className="tile-index">{property.code}</span>
                        <span className="tile-arrow">
                          <Arrow />
                        </span>
                      </span>
                      <span className="tile-body">
                        <span className="tile-kicker">
                          {property.project} · {statusLabel(property.status)}
                        </span>
                        <span className="tile-title">{property.title}</span>
                        <span className="tile-meta">
                          {egp(property.price, true)}
                          {property.monthly_installment != null
                            ? ` · ${egp(property.monthly_installment)} ${t.monthly}`
                            : ` · ${specs}`}
                        </span>
                      </span>
                      <span className="tile-line" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="public-empty">{t.empty}</p>
            )}
          </div>
        </section>
      </main>

      <PublicFooter
        c={c}
        contact={contact}
        lang={lang}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
      />
    </>
  );
}
