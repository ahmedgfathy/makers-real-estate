import { notFound } from "next/navigation";
import {
  addFollowUpAction,
  setFollowUpDateAction,
  updateLeadStatusAction,
} from "../actions";
import {
  FOLLOW_UP_CHANNELS,
  FOLLOW_UP_OUTCOMES,
  getLead,
  LEAD_STATUSES,
  listFollowUps,
} from "@/lib/admin";
import { budget, daysOverdue, formatDate, followUpLabel, phoneDigits, timeAgo, titleCase } from "@/lib/format";
import { FollowUpBadge, SourceBadge, StatusBadge, TemperatureBadge } from "@/components/dashboard/Badges";

export const dynamic = "force-dynamic";

/** Hot leads come back tomorrow, cold ones in a week, everything else in three days. */
function suggestNext(temperature: string | null): string {
  const offset = temperature === "hot" ? 1 : temperature === "cold" ? 7 : 3;
  const next = new Date();
  next.setDate(next.getDate() + offset);
  return next.toISOString().slice(0, 10);
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) notFound();

  const [lead, followUps] = await Promise.all([getLead(leadId), listFollowUps(leadId)]);
  if (!lead) notFound();

  const digits = phoneDigits(lead.phone);
  const callable = digits.length >= 8;
  const international = digits.startsWith("0") ? `20${digits.slice(1)}` : digits;
  const overdue = daysOverdue(lead.next_follow_up_on);
  const isOpen = lead.status !== "won" && lead.status !== "lost";

  return (
    <div className="dash-page">
      <a className="dash-back" href="/dashboard/leads">
        ← Back to leads
      </a>

      <header className="dash-head">
        <div>
          <span className="dash-kicker">
            Lead #{lead.id} · received {formatDate(lead.created_at)}
          </span>
          <h1>{lead.full_name}</h1>
          <div className="dash-meta-row" style={{ marginTop: "0.7rem" }}>
            <SourceBadge source={lead.source} />
            <StatusBadge status={lead.status} />
            <TemperatureBadge temperature={lead.temperature} />
            {lead.project ? <span>{lead.project}</span> : null}
            {lead.assigned_to ? <span>{lead.assigned_to}</span> : <span>Unassigned</span>}
          </div>
        </div>
        <div className="dash-actions">
          {callable ? (
            <>
              <a
                className="dash-btn"
                href={`https://wa.me/${international}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <a className="dash-btn" href={`tel:${digits}`}>
                Call
              </a>
            </>
          ) : (
            <span className="dash-pill">Social handle — no phone number</span>
          )}
          {lead.email ? (
            <a className="dash-btn dash-btn--quiet" href={`mailto:${lead.email}`}>
              Email
            </a>
          ) : null}
        </div>
      </header>

      {isOpen && overdue != null && overdue >= 0 ? (
        <p className="dash-alert" style={{ marginBottom: "1rem" }}>
          {followUpLabel(lead.next_follow_up_on)} — {lead.assigned_to ?? "this lead"} should be
          contacted today.
        </p>
      ) : null}

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
                    {callable ? (
                      <a className="phone" href={`tel:${digits}`}>
                        {lead.phone}
                      </a>
                    ) : (
                      `${lead.phone} (handle)`
                    )}
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
                  <dt>Preferred area</dt>
                  <dd>{lead.preferred_area ?? "—"}</dd>
                </div>
                <div>
                  <dt>Budget</dt>
                  <dd>{budget(lead.budget_min, lead.budget_max)}</dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>{lead.payment_preference ? titleCase(lead.payment_preference) : "—"}</dd>
                </div>
                <div>
                  <dt>Buying for</dt>
                  <dd>{lead.intent ? titleCase(lead.intent) : "—"}</dd>
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
              <h2 className="dash-card-title">Brief / notes</h2>
            </div>
            <div className="dash-card-body">
              <p className="detail-note" dir="auto">
                {lead.message ?? "No message was left with this enquiry."}
              </p>
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
              <h2 className="dash-card-title">Follow-up</h2>
              <FollowUpBadge date={lead.next_follow_up_on} />
            </div>
            <div className="dash-card-body">
              <form action={addFollowUpAction} id="follow-up-form" className="dash-form" style={{ gap: "0.7rem" }}>
                <input type="hidden" name="id" value={lead.id} />
                <div className="dash-form-grid">
                  <label className="dash-field">
                    <span>Channel</span>
                    <select className="dash-select" name="channel" defaultValue="call">
                      {FOLLOW_UP_CHANNELS.map((channel) => (
                        <option key={channel} value={channel}>
                          {titleCase(channel)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="dash-field">
                    <span>Outcome</span>
                    <select className="dash-select" name="outcome" defaultValue="reached">
                      {FOLLOW_UP_OUTCOMES.map((outcome) => (
                        <option key={outcome} value={outcome}>
                          {titleCase(outcome)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="dash-field">
                    <span>Move status to</span>
                    <select className="dash-select" name="next_status" defaultValue="">
                      <option value="">Keep {titleCase(lead.status)}</option>
                      {LEAD_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {titleCase(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="dash-field">
                    <span>Follow up on</span>
                    <input
                      className="dash-input"
                      type="date"
                      name="follow_up_on"
                      defaultValue={suggestNext(lead.temperature)}
                    />
                  </label>
                  <label className="dash-field span-3">
                    <span>What happened?</span>
                    <textarea
                      className="dash-textarea"
                      name="note"
                      rows={2}
                      placeholder="Called twice, no answer. Will WhatsApp the brief."
                    />
                  </label>
                </div>
                <button type="submit" className="dash-btn dash-btn--gold">
                  Log contact
                </button>
              </form>

              <form action={setFollowUpDateAction} id="reschedule-form" className="dash-form" style={{ gap: "0.5rem", marginTop: "1rem" }}>
                <input type="hidden" name="id" value={lead.id} />
                <label className="dash-field">
                  <span>Next follow-up date only</span>
                  <input
                    className="dash-input"
                    type="date"
                    name="next_follow_up_on"
                    defaultValue={lead.next_follow_up_on ?? ""}
                  />
                </label>
                <button type="submit" className="dash-btn dash-btn--quiet">
                  Reschedule
                </button>
              </form>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">Pipeline status</h2>
            </div>
            <div className="dash-card-body">
              <form action={updateLeadStatusAction} id="status-form" className="dash-form" style={{ gap: "0.7rem" }}>
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
              <h2 className="dash-card-title">Contact log</h2>
              <span className="dash-count">{lead.follow_up_count}</span>
            </div>
            {followUps.length ? (
              <ul className="dash-log">
                {followUps.map((entry) => (
                  <li className="dash-log-item" key={entry.id}>
                    <div className="dash-log-head">
                      <strong>{titleCase(entry.channel)}</strong>
                      <span className="dash-badge" data-tone={entry.outcome === "reached" ? "contacted" : "new"}>
                        {titleCase(entry.outcome)}
                      </span>
                      <span className="cell-sub">{timeAgo(entry.logged_at)}</span>
                    </div>
                    {entry.note ? (
                      <p className="dash-log-note" dir="auto">
                        {entry.note}
                      </p>
                    ) : null}
                    <div className="dash-log-foot">
                      <span>{entry.author}</span>
                      {entry.follow_up_on ? <span>→ next {formatDate(entry.follow_up_on)}</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="dash-card-body">
                <p className="detail-note">
                  No contact logged yet. {lead.assigned_to ?? "The consultant"} owns this lead —
                  record the first call so the team sees the latest stage.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
