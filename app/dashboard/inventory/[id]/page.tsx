import { notFound } from "next/navigation";
import { getProperty, PROPERTY_STATUSES } from "@/lib/admin";
import { area, egp, formatDate, titleCase } from "@/lib/format";
import { StatusBadge } from "@/components/dashboard/Badges";
import { updatePropertyStatusAction } from "../actions";
import { canPublish, getSession } from "@/lib/auth";
import PublishToggle from "@/components/dashboard/PublishToggle";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propertyId = Number(id);
  if (!Number.isInteger(propertyId)) notFound();

  const property = await getProperty(propertyId);
  if (!property) notFound();
  const mayPublish = canPublish(await getSession());

  const images = property.images.length ? property.images : ["/img/lakes-pool.jpg"];

  return (
    <div className="dash-page">
      <a className="dash-back" href="/dashboard/inventory">
        ← Back to inventory
      </a>

      <header className="dash-head">
        <div>
          <span className="dash-kicker">
            {property.code} · {property.project}
            {property.phase ? ` · ${property.phase}` : ""}
          </span>
          <h1>{property.title}</h1>
          <div className="dash-meta-row" style={{ marginTop: "0.7rem" }}>
            <StatusBadge status={property.status} />
            <span>{titleCase(property.property_type)}</span>
            <span>{titleCase(property.listing_type)}</span>
            {property.delivery ? <span>Delivery {property.delivery}</span> : null}
          </div>
        </div>
        <div className="dash-actions">
          <PublishToggle
            kind="property"
            id={property.id}
            published={property.published}
            canPublish={mayPublish}
          />
          <a className="dash-btn" href="/dashboard/inventory">
            All inventory
          </a>
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-side">
          <section className="dash-card">
            <div className="dash-card-body">
              <div className="inv-gallery">
                {images.slice(0, 3).map((src, index) => (
                  <a key={`${src}-${index}`} href={src} target="_blank" rel="noopener noreferrer">
                    <img src={src} alt={`${property.title} — image ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
                  </a>
                ))}
              </div>

              {property.video ? (
                <div className="inv-video">
                  <video controls preload="metadata" poster={images[0]}>
                    <source src={property.video} type="video/mp4" />
                  </video>
                </div>
              ) : null}
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Description</h2>
            </div>
            <div className="dash-card-body">
              <p className="detail-note">{property.description ?? "No description added yet."}</p>

              {property.amenities.length ? (
                <>
                  <h3 className="dash-card-title" style={{ marginTop: "1.1rem", marginBottom: "0.6rem" }}>
                    Amenities
                  </h3>
                  <div className="chip-list">
                    {property.amenities.map((amenity) => (
                      <span className="chip" key={amenity}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Standard data</h2>
            </div>
            <div className="dash-card-body">
              <dl className="detail-list">
                <div>
                  <dt>Unit code</dt>
                  <dd className="phone">{property.code}</dd>
                </div>
                <div>
                  <dt>Project / phase</dt>
                  <dd>
                    {property.project}
                    {property.phase ? ` · ${property.phase}` : ""}
                  </dd>
                </div>
                <div>
                  <dt>Property type</dt>
                  <dd>{titleCase(property.property_type)}</dd>
                </div>
                <div>
                  <dt>Bedrooms / bathrooms</dt>
                  <dd>
                    {property.bedrooms ?? "—"} / {property.bathrooms ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt>Built-up area</dt>
                  <dd>{area(property.built_up_area)}</dd>
                </div>
                <div>
                  <dt>Garden</dt>
                  <dd>{area(property.garden_area)}</dd>
                </div>
                <div>
                  <dt>Roof</dt>
                  <dd>{area(property.roof_area)}</dd>
                </div>
                <div>
                  <dt>Floor</dt>
                  <dd>{property.floor ?? "—"}</dd>
                </div>
                <div>
                  <dt>Finishing</dt>
                  <dd>{property.finishing ?? "—"}</dd>
                </div>
                <div>
                  <dt>View</dt>
                  <dd>{property.view ?? "—"}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd>{property.delivery ?? "—"}</dd>
                </div>
                <div>
                  <dt>Listed</dt>
                  <dd>{formatDate(property.created_at)}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        <div className="detail-side">
          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Price &amp; payment</h2>
            </div>
            <div className="dash-card-body">
              <div className="detail-amount">{egp(property.price)}</div>
              <div className="detail-subamount">
                {property.currency}
                {property.monthly_installment != null
                  ? ` · ${egp(property.monthly_installment)} / month`
                  : ""}
              </div>

              <dl className="detail-list" style={{ marginTop: "1rem" }}>
                <div>
                  <dt>Down payment</dt>
                  <dd>{egp(property.down_payment)}</dd>
                </div>
                <div>
                  <dt>Installments</dt>
                  <dd>{property.installment_years} years</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Availability</h2>
            </div>
            <div className="dash-card-body">
              <form action={updatePropertyStatusAction} className="dash-form" style={{ gap: "0.7rem" }}>
                <input type="hidden" name="id" value={property.id} />
                <label className="dash-field">
                  <span>Status</span>
                  <select className="dash-select" name="status" defaultValue={property.status}>
                    {PROPERTY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {titleCase(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="dash-btn dash-btn--gold">
                  Update availability
                </button>
              </form>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Media</h2>
            </div>
            <div className="dash-card-body">
              <div className="dash-meta-row">
                <span>
                  <strong>{property.images.length}</strong> images
                </span>
                <span>
                  <strong>{property.video ? "1" : "0"}</strong> video
                </span>
              </div>
              <p className="detail-note" style={{ marginTop: "0.7rem" }}>
                {property.video
                  ? "The listing has a project film attached and plays on the detail view."
                  : "No video attached. Add a video URL when editing the media set."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
