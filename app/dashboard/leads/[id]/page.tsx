import { notFound } from "next/navigation";
import { getLead, LEAD_STATUSES } from "@/lib/admin";
import { budget, formatDate, timeAgo, titleCase } from "@/lib/format";
import { SourceBadge, StatusBadge } from "@/components/dashboard/Badges";
import { updateLeadStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) notFound();

  const lead = await getLead(leadId);
  if (!lead) notFound();

  const digits = lead.phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `20${digits.slice(1)}` : digits;
  const whatsapp = `https://wa.me/${international}`;

  return (
    <div className="dash-page">
      <a className="dash-back" href="/dashboard/leads">
        ← Back to leads
      </a>

      <header className="dash-head">
        <div>
          <span className="dash-kicker">
            Lead #{lead.id} · {timeAgo(lead.created_at)}
          </span>
          <h1>{lead.full_name}</h1>
          <div className="dash-meta-row" style={{ marginTop: "0.7rem" }}>
            <SourceBadge source={lead.source} />
            <StatusBadge status={lead.status} />
            {lead.project ? <span>{lead.project}</span> : null}
            {lead.form_name ? <span>{lead.form_name}</span> : null}
          </div>
        </div>
        <div className="dash-actions">
          <a className="dash-btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a className="dash-btn" href={`tel:${digits}`}>
            Call
          </a>
          {lead.email ? (
            <a className="dash-btn dash-btn--quiet" href={`mailto:${lead.email}`}>
              Email
            </a>
          ) : null}
        </div>
      </header>

      <div className="detail-grid">
        <div className="detail-side">
          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Contact &amp; requirement</h2>
            </div>
            <div className="dash-card-body">
              <dl className="detail-list">
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a className="phone" href={`tel:${digits}`}>
                      {lead.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{lead.email ?? "—"}</dd>
                </div>
                <div>
                  <dt>Project interest</dt>
                  <dd>{lead.project ?? "—"}</dd>
                </div>
                <div>
                  <dt>Unit type</dt>
                  <dd>{lead.property_type ?? "—"}</dd>
                </div>
                <div>
                  <dt>Bedrooms</dt>
                  <dd>{lead.bedrooms ?? "—"}</dd>
                </div>
                <div>
                  <dt>Budget</dt>
                  <dd>{budget(lead.budget_min, lead.budget_max)}</dd>
                </div>
                <div>
                  <dt>Assigned to</dt>
                  <dd>{lead.assigned_to ?? "Unassigned"}</dd>
                </div>
                <div>
                  <dt>Consent</dt>
                  <dd>{lead.consent ? "Given" : "Not recorded"}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Message</h2>
            </div>
            <div className="dash-card-body">
              <p className="detail-note">{lead.message ?? "No message was left with this enquiry."}</p>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Source tracking</h2>
            </div>
            <div className="dash-card-body">
              <dl className="detail-list">
                <div>
                  <dt>Source</dt>
                  <dd>{titleCase(lead.source)}</dd>
                </div>
                <div>
                  <dt>Form</dt>
                  <dd>{lead.form_name ?? "—"}</dd>
                </div>
                <div>
                  <dt>Campaign</dt>
                  <dd>{lead.campaign ?? "—"}</dd>
                </div>
                <div>
                  <dt>External ID</dt>
                  <dd className="phone" style={{ direction: "ltr" }}>
                    {lead.external_id ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDate(lead.created_at)}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatDate(lead.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        <div className="detail-side">
          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Pipeline status</h2>
            </div>
            <div className="dash-card-body">
              <form action={updateLeadStatusAction} className="dash-form" style={{ gap: "0.7rem" }}>
                <input type="hidden" name="id" value={lead.id} />
                <label className="dash-field">
                  <span>Current status</span>
                  <select className="dash-select" name="status" defaultValue={lead.status}>
                    {LEAD_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {titleCase(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="dash-btn dash-btn--gold">
                  Update status
                </button>
              </form>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Consultant note</h2>
            </div>
            <div className="dash-card-body">
              <p className="detail-note">
                {lead.assigned_to
                  ? `${lead.assigned_to} owns this lead. Update the pipeline status after every call so the team sees the latest stage.`
                  : "This lead is unassigned. Route it to a consultant, then update the pipeline status after the first call."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
