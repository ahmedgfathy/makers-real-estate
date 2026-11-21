import {
  LEAD_INTENTS,
  LEAD_PAYMENTS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_TEMPERATURES,
} from "@/lib/admin";
import {
  ancestorLocations,
  getCatalogOptions,
  listUnits,
  projectName,
  unitTitle,
} from "@/lib/catalog";
import { titleCase } from "@/lib/format";
import { createLeadAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [options, units] = await Promise.all([
    getCatalogOptions(),
    listUnits({ pageSize: 1000 }),
  ]);
  const locationLabel = (id: string) => {
    const location = options.locations.find((item) => item.id === id);
    return location
      ? [...ancestorLocations(options.locations, location), location].map((item) => item.nameEn).join(" / ")
      : id;
  };

  return (
    <div className="dash-page" style={{ maxWidth: "980px" }}>
      <a className="dash-back" href="/dashboard/leads">
        ← Back to leads
      </a>

      <header className="dash-head">
        <div>
          <span className="dash-kicker">New lead</span>
          <h1>Add an enquiry</h1>
          <p>
            Use this for a phone call, a WhatsApp message or a walk-in. Facebook lead-ad submissions
            arrive through the API with their form and campaign attached.
          </p>
        </div>
      </header>

      {error ? <p className="dash-alert" style={{ marginBottom: "1rem" }}>{error}</p> : null}

      <form className="dash-form" action={createLeadAction}>
        <section className="dash-form-section">
          <h2>Contact</h2>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Full name *</span>
              <input className="dash-input" name="full_name" required autoComplete="off" />
            </label>
            <label className="dash-field">
              <span>Phone *</span>
              <input className="dash-input" name="phone" required autoComplete="off" placeholder="0100 000 0000" />
            </label>
            <label className="dash-field">
              <span>Email</span>
              <input className="dash-input" type="email" name="email" autoComplete="off" />
            </label>
          </div>
        </section>

        <section className="dash-form-section">
          <h2>Catalogue classification</h2>
          <p className="dash-muted" style={{ marginBottom: "1rem" }}>
            Choose real catalogue records wherever possible. These IDs power CRM filters, reports and
            public-site context. Free-text fields below remain available for details that have no record yet.
          </p>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Location / area</span>
              <select className="dash-select" name="locationId" defaultValue="">
                <option value="">Not classified</option>
                {options.locations.map((location) => (
                  <option key={location.id} value={location.id}>{locationLabel(location.id)}</option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Project</span>
              <select className="dash-select" name="projectId" defaultValue="">
                <option value="">Not classified</option>
                {options.projects.map((project) => (
                  <option key={project.id} value={project.id}>{projectName(project, "en")}</option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Property category</span>
              <select className="dash-select" name="categoryId" defaultValue="">
                <option value="">Not classified</option>
                {options.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.nameEn}</option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Specific unit</span>
              <select className="dash-select" name="unitId" defaultValue="">
                <option value="">Not classified</option>
                {units.items.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unitTitle(unit, "en")} · {unit.projectNameEn}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Canonical budget (EGP)</span>
              <input className="dash-input" type="number" name="budget" min="0" step="100000" />
            </label>
            <label className="dash-field">
              <span>Lead language</span>
              <select className="dash-select" name="locale" defaultValue="en">
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </label>
          </div>
        </section>

        <section className="dash-form-section">
          <h2>Requirement details</h2>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Project</span>
              <input className="dash-input" name="project" placeholder="SODIC East, The Lakes…" />
            </label>
            <label className="dash-field">
              <span>Unit type</span>
              <input className="dash-input" name="property_type" placeholder="Apartment, duplex, villa…" />
            </label>
            <label className="dash-field">
              <span>Bedrooms</span>
              <input className="dash-input" type="number" name="bedrooms" min="0" max="10" />
            </label>
            <label className="dash-field">
              <span>Preferred area</span>
              <input className="dash-input" name="preferred_area" placeholder="New Heliopolis, Fifth Settlement…" />
            </label>
            <label className="dash-field">
              <span>Budget from (EGP)</span>
              <input className="dash-input" type="number" name="budget_min" min="0" step="100000" />
            </label>
            <label className="dash-field">
              <span>Budget to (EGP)</span>
              <input className="dash-input" type="number" name="budget_max" min="0" step="100000" />
            </label>
            <label className="dash-field">
              <span>Payment preference</span>
              <select className="dash-select" name="payment_preference" defaultValue="">
                <option value="">Not discussed</option>
                {LEAD_PAYMENTS.map((option) => (
                  <option key={option} value={option}>
                    {titleCase(option)}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Buying for</span>
              <select className="dash-select" name="intent" defaultValue="">
                <option value="">Unknown</option>
                {LEAD_INTENTS.map((option) => (
                  <option key={option} value={option}>
                    {titleCase(option)}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Lead temperature</span>
              <select className="dash-select" name="temperature" defaultValue="warm">
                <option value="">Unrated</option>
                {LEAD_TEMPERATURES.map((option) => (
                  <option key={option} value={option}>
                    {titleCase(option)}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-field span-3">
              <span>Brief / notes</span>
              <textarea
                className="dash-textarea"
                name="message"
                placeholder="What did the buyer ask for? Budget, floor, view, anything they said."
              />
            </label>
          </div>
        </section>

        <section className="dash-form-section">
          <h2>Source &amp; routing</h2>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Source</span>
              <select className="dash-select" name="source" defaultValue="manual">
                {LEAD_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {titleCase(source)}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Form / campaign</span>
              <input className="dash-input" name="form_name" placeholder="Lead form name" />
            </label>
            <label className="dash-field">
              <span>Facebook campaign</span>
              <input className="dash-input" name="campaign" placeholder="Campaign name" />
            </label>
            <label className="dash-field">
              <span>External / leadgen ID</span>
              <input className="dash-input" name="external_id" placeholder="Optional" />
            </label>
            <label className="dash-field">
              <span>Status</span>
              <select className="dash-select" name="status" defaultValue="new">
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-field">
              <span>Assigned to</span>
              <input className="dash-input" name="assigned_to" placeholder="Consultant" />
            </label>
            <label className="dash-field">
              <span>Follow up on</span>
              <input
                className="dash-input"
                type="date"
                name="next_follow_up_on"
                defaultValue={tomorrow.toISOString().slice(0, 10)}
              />
            </label>
            <label className="dash-check" style={{ alignSelf: "end", paddingBottom: "0.55rem" }}>
              <input type="checkbox" name="consent" />
              Marketing consent given
            </label>
          </div>
        </section>

        <div className="dash-form-actions">
          <button type="submit" className="dash-btn dash-btn--gold">
            Save lead
          </button>
          <a className="dash-btn dash-btn--quiet" href="/dashboard/leads">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
