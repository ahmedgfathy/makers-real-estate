import type { Property } from "@/lib/admin";
import { area, egp } from "@/lib/format";
import { StatusBadge } from "./Badges";

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0] ?? "/img/lakes-pool.jpg";

  return (
    <a className="inv-card" href={`/dashboard/inventory/${property.id}`}>
      <span className="inv-media">
        <img src={cover} alt={property.title} loading="lazy" decoding="async" />
        <span className="inv-media-top">
          <span className="inv-code">{property.code}</span>
          {property.video ? (
            <span className="inv-video-tag">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 1.2v7.6L8.6 5 2 1.2z" fill="currentColor" />
              </svg>
              Video
            </span>
          ) : (
            <StatusBadge status={property.status} />
          )}
        </span>
      </span>

      <span className="inv-body">
        <span className="inv-project">
          {property.project}
          {property.phase ? ` · ${property.phase}` : ""}
        </span>
        <span className="inv-title">{property.title}</span>
        <span className="inv-specs">
          {property.bedrooms != null ? <span>{property.bedrooms} bed</span> : null}
          {property.bathrooms != null ? <span>{property.bathrooms} bath</span> : null}
          {property.built_up_area != null ? <span>{area(property.built_up_area)}</span> : null}
        </span>
        <span className="inv-price-row">
          <span className="inv-price">{egp(property.price)}</span>
          {property.monthly_installment != null ? (
            <span className="inv-month">{egp(property.monthly_installment)}/mo</span>
          ) : null}
        </span>
      </span>
    </a>
  );
}
