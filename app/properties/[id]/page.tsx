import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Lang } from "@/data/content";
import { whatsappLink } from "@/data/content";
import { getSite } from "@/lib/content-db";
import { area, egp, titleCase } from "@/lib/format";
import { getProperty } from "@/lib/admin";
import Arrow from "@/components/public/Arrow";
import LangSync from "@/components/public/LangSync";
import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";

export const dynamic = "force-dynamic";

/**
 * Public detail view for a single inventory unit.
 *
 * A unit is reachable only while its CRM publish checkbox is on; anything else
 * returns a 404 so drafts stay internal.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const propertyId = Number(id);
  if (!Number.isInteger(propertyId)) return { title: "Unit not found — Makers Real Estate" };

  const property = await getProperty(propertyId);
  if (!property?.published) return { title: "Unit not found — Makers Real Estate" };

  return {
    title: `${property.title} — Makers Real Estate`,
    description:
      property.description ??
      `${titleCase(property.property_type)} in ${property.project}, ${egp(property.price)}.`,
    openGraph: property.images.length ? { images: [property.images[0]] } : undefined,
  };
}

export default async function PublicPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const lang: Lang = query.lang === "ar" ? "ar" : "en";

  const propertyId = Number(id);
  if (!Number.isInteger(propertyId)) notFound();

  const [{ content, contact }, property] = await Promise.all([
    getSite(),
    getProperty(propertyId),
  ]);

  if (!property?.published) notFound();

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);
  const images = property.images.length ? property.images : ["/img/lakes-pool.jpg"];

  const t =
    lang === "ar"
      ? {
          back: "→ العودة إلى الوحدات",
          book: "احجز معاينة",
          call: "اتصل بنا",
          price: "السعر",
          monthly: "/ شهر",
          down: "المقدم",
          years: "سنوات التقسيط",
          type: "نوع الوحدة",
          beds: "غرف النوم",
          baths: "الحمامات",
          builtUp: "المساحة المبنية",
          garden: "الحديقة",
          roof: "الروف",
          floor: "الدور",
          finishing: "التشطيب",
          view: "الإطلالة",
          delivery: "التسليم",
          about: "عن الوحدة",
          amenities: "الخدمات",
          gallery: "صور الوحدة",
          note: "الأسعار استرشادية وتُعتمد في عقد الحجز.",
          noDescription: "لم يُضف وصف للوحدة بعد.",
        }
      : {
          back: "← Back to units",
          book: "Book a viewing",
          call: "Call the advisor",
          price: "Price",
          monthly: "/ mo",
          down: "Down payment",
          years: "Installment years",
          type: "Property type",
          beds: "Bedrooms",
          baths: "Bathrooms",
          builtUp: "Built-up area",
          garden: "Garden",
          roof: "Roof",
          floor: "Floor",
          finishing: "Finishing",
          view: "View",
          delivery: "Delivery",
          about: "About this unit",
          amenities: "Amenities",
          gallery: "Unit photos",
          note: "Prices are indicative and confirmed in the reservation contract.",
          noDescription: "No description has been added for this unit yet.",
        };

  const facts = [
    { label: t.type, value: titleCase(property.property_type) },
    { label: t.beds, value: property.bedrooms ?? "—" },
    { label: t.baths, value: property.bathrooms ?? "—" },
    { label: t.builtUp, value: area(property.built_up_area) },
    { label: t.garden, value: area(property.garden_area) },
    { label: t.roof, value: area(property.roof_area) },
    { label: t.floor, value: property.floor ?? "—" },
    { label: t.finishing, value: property.finishing ?? "—" },
    { label: t.view, value: property.view ?? "—" },
    { label: t.delivery, value: property.delivery ?? "—" },
  ];

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <LangSync lang={lang} />
      <PublicHeader
        c={c}
        lang={lang}
        basePath={`/properties/${property.id}`}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
        active="properties"
      />

      <main className="public-main">
        <section className="collection">
          <div className="collection-inner">
            <a className="public-back" href={`/properties?lang=${lang}`}>
              {t.back}
            </a>

            <div className="public-hero">
              <div className="public-hero-media">
                <img
                  src={images[0]}
                  alt={property.title}
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="public-hero-body">
                <span className="eyebrow">
                  {property.code} · {titleCase(property.property_type)}
                </span>
                <h1 className="public-title">{property.title}</h1>
                <p className="public-hero-meta">
                  {property.project}
                  {property.phase ? ` · ${property.phase}` : ""}
                  {property.delivery ? ` · ${t.delivery} ${property.delivery}` : ""}
                </p>

                <div className="public-price">
                  <strong>{egp(property.price)}</strong>
                  {property.monthly_installment != null ? (
                    <span>
                      {egp(property.monthly_installment)} {t.monthly}
                    </span>
                  ) : null}
                </div>

                <div className="public-cta">
                  <a
                    className="btn btn--solid btn--sm"
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="whatsapp"
                    data-cta-surface="property"
                  >
                    <span>{t.book}</span>
                  </a>
                  <a
                    className="btn btn--ghost btn--sm phone"
                    href={contact.phoneHref}
                    data-cta="phone"
                    data-cta-surface="property"
                  >
                    <span>{t.call}</span>
                    <Arrow />
                  </a>
                </div>
              </div>
            </div>

            <div className="stats public-facts">
              <div className="stat">
                <div className="stat-value">{titleCase(property.property_type)}</div>
                <div className="stat-label">{t.type}</div>
              </div>
              <div className="stat">
                <div className="stat-value">{property.bedrooms ?? "—"}</div>
                <div className="stat-label">{t.beds}</div>
              </div>
              <div className="stat">
                <div className="stat-value">{area(property.built_up_area)}</div>
                <div className="stat-label">{t.builtUp}</div>
              </div>
              <div className="stat">
                <div className="stat-value">{egp(property.down_payment, true)}</div>
                <div className="stat-label">
                  {t.down} · {property.installment_years} {t.years}
                </div>
              </div>
            </div>

            <div className="sec">
              <div className="sec-head">
                <span className="sec-title">{t.about}</span>
                <span className="sec-rule" />
              </div>
              <p className="panel-lede">{property.description ?? t.noDescription}</p>
            </div>

            <div className="sec">
              <div className="sec-head">
                <span className="sec-title">{t.type}</span>
                <span className="sec-rule" />
              </div>
              <div className="detail-facts">
                {facts.map((fact) => (
                  <div className="detail-fact" key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {property.amenities.length ? (
              <div className="sec">
                <div className="sec-head">
                  <span className="sec-title">{t.amenities}</span>
                  <span className="sec-rule" />
                </div>
                <ul className="list-grid cols-3">
                  {property.amenities.map((amenity) => (
                    <li className="li" key={amenity}>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {images.length > 1 ? (
              <div className="sec">
                <div className="sec-head">
                  <span className="sec-title">{t.gallery}</span>
                  <span className="sec-rule" />
                </div>
                <div className="gallery">
                  {images.slice(1, 10).map((src, index) => (
                    <figure key={`${src}-${index}`}>
                      <img
                        src={src}
                        alt={`${property.title} — ${index + 2}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            {property.video ? (
              <div className="sec">
                <div className="public-video">
                  <video controls preload="metadata" poster={images[0]}>
                    <source src={property.video} type="video/mp4" />
                  </video>
                </div>
              </div>
            ) : null}

            <p className="note">{t.note}</p>
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
