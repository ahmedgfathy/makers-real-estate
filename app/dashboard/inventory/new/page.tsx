import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from "@/lib/admin";
import { titleCase } from "@/lib/format";
import { createPropertyAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="dash-page" style={{ maxWidth: "1080px" }}>
      <a className="dash-back" href="/dashboard/inventory">
        ← Back to inventory
      </a>

      <header className="dash-head">
        <div>
          <span className="dash-kicker">New property</span>
          <h1>Add a unit</h1>
          <p>
            Capture the standard inventory data. Codes must be unique; the monthly figure is derived
            from price ÷ (years × 12) when left blank.
          </p>
        </div>
      </header>

      {error ? <p className="dash-alert" style={{ marginBottom: "1rem" }}>{error}</p> : null}

      <form className="dash-form" action={createPropertyAction}>
        <section className="dash-form-section">
          <h2>Identity</h2>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Unit code *</span>
              <input className="dash-input" name="code" required placeholder="e.g. B20-31" />
            </label>
            <label className="dash-field span-2">
              <span>Title *</span>
              <input className="dash-input" name="title" required placeholder="2-bedroom apartment · Upper floors" />
            </label>
            <label className="dash-field">
              <span>Project</span>
              <input className="dash-input" name="project" defaultValue="SODIC East" />
            </label>
            <label className="dash-field">
              <span>Phase</span>
              <input className="dash-input" name="phase" placeholder="Phase 08M / SODIC East 2" />
            </label>
            <label className="dash-field">
              <span>Property type</span>
              <select className="dash-select" name="property_type" defaultValue="apartment">
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {titleCase(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Listing</span>
              <select className="dash-select" name="listing_type" defaultValue="sale">
                <option value="sale">Sale</option>
                <option value="resale">Resale</option>
                <option value="rent">Rent</option>
              </select>
            </label>
            <label className="dash-field">
              <span>Status</span>
              <select className="dash-select" name="status" defaultValue="available">
                {PROPERTY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-check" style={{ alignSelf: "end", paddingBottom: "0.55rem" }}>
              <input type="checkbox" name="featured" />
              Featured listing
            </label>
          </div>
        </section>

        <section className="dash-form-section">
          <h2>Specification</h2>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Bedrooms</span>
              <input className="dash-input" type="number" name="bedrooms" min="0" max="12" />
            </label>
            <label className="dash-field">
              <span>Bathrooms</span>
              <input className="dash-input" type="number" name="bathrooms" min="0" max="12" />
            </label>
            <label className="dash-field">
              <span>Built-up area (m²)</span>
              <input className="dash-input" type="number" name="built_up_area" min="0" step="0.01" />
            </label>
            <label className="dash-field">
              <span>Garden area (m²)</span>
              <input className="dash-input" type="number" name="garden_area" min="0" step="0.01" />
            </label>
            <label className="dash-field">
              <span>Roof area (m²)</span>
              <input className="dash-input" type="number" name="roof_area" min="0" step="0.01" />
            </label>
            <label className="dash-field">
              <span>Floor</span>
              <input className="dash-input" name="floor" placeholder="Ground + garden / 3rd" />
            </label>
            <label className="dash-field">
              <span>Finishing</span>
              <input className="dash-input" name="finishing" placeholder="Fully finished / core & shell" />
            </label>
            <label className="dash-field">
              <span>View</span>
              <input className="dash-input" name="view" placeholder="Lagoon / green spine" />
            </label>
          </div>
        </section>

        <section className="dash-form-section">
          <h2>Pricing &amp; delivery</h2>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Price (EGP) *</span>
              <input className="dash-input" type="number" name="price" required min="0" step="1000" />
            </label>
            <label className="dash-field">
              <span>Down payment (EGP)</span>
              <input className="dash-input" type="number" name="down_payment" min="0" step="1000" />
            </label>
            <label className="dash-field">
              <span>Installment years</span>
              <input className="dash-input" type="number" name="installment_years" min="1" max="30" defaultValue="10" />
            </label>
            <label className="dash-field">
              <span>Monthly installment (EGP)</span>
              <input className="dash-input" type="number" name="monthly_installment" min="0" step="1" />
            </label>
            <label className="dash-field">
              <span>Delivery</span>
              <input className="dash-input" name="delivery" placeholder="December 2026" />
            </label>
            <label className="dash-field">
              <span>Currency</span>
              <input className="dash-input" value="EGP" disabled />
            </label>
          </div>
        </section>

        <section className="dash-form-section">
          <h2>Media &amp; notes</h2>
          <div className="dash-form-grid">
            <label className="dash-field span-2">
              <span>Image URLs</span>
              <textarea
                className="dash-textarea"
                name="images"
                placeholder={"/img/lakes-pool.jpg\n/img/lakes-garden.jpg\n/img/lakes-building.jpg"}
              />
            </label>
            <label className="dash-field">
              <span>Video URL</span>
              <input className="dash-input" name="video" placeholder="/video/hero.mp4" />
            </label>
            <label className="dash-field span-3">
              <span>Amenities</span>
              <textarea
                className="dash-textarea"
                name="amenities"
                placeholder="Private garden, lagoon view, sports club access"
                style={{ minHeight: "70px" }}
              />
            </label>
            <label className="dash-field span-3">
              <span>Description</span>
              <textarea className="dash-textarea" name="description" />
            </label>
          </div>
        </section>

        <div className="dash-form-actions">
          <button type="submit" className="dash-btn dash-btn--gold">
            Save property
          </button>
          <a className="dash-btn dash-btn--quiet" href="/dashboard/inventory">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
