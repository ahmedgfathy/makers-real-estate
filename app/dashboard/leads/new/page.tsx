import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/admin";
import { titleCase } from "@/lib/format";
import { createLeadAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
              <input className="dash-input" name="phone" required autoComplete="off" />
            </label>
            <label className="dash-field">
              <span>Email</span>
              <input className="dash-input" type="email" name="email" autoComplete="off" />
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
              <input className="dash-input" name="form_name" placeholder="e.g. The Lakes — Request a call" />
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
          </div>
        </section>

        <section className="dash-form-section">
          <h2>Requirement</h2>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Project</span>
              <input className="dash-input" name="project" placeholder="The Lakes / SODIC East / Phase 08M" />
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
              <span>Budget from (EGP)</span>
              <input className="dash-input" type="number" name="budget_min" min="0" step="100000" />
            </label>
            <label className="dash-field">
              <span>Budget to (EGP)</span>
              <input className="dash-input" type="number" name="budget_max" min="0" step="100000" />
            </label>
            <label className="dash-check" style={{ alignSelf: "end", paddingBottom: "0.55rem" }}>
              <input type="checkbox" name="consent" />
              Marketing consent given
            </label>
            <label className="dash-field span-3">
              <span>Message / notes</span>
              <textarea className="dash-textarea" name="message" placeholder="What did the buyer ask for?" />
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
