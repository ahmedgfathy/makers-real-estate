import { getConsultantBreakdown, getFollowUpAlerts, listLeads, type Lead } from "@/lib/admin";
import { daysOverdue, followUpLabel, formatDate, phoneDigits, timeAgo } from "@/lib/format";
import { StatusBadge } from "@/components/dashboard/Badges";

export const dynamic = "force-dynamic";

type Search = { consultant?: string };

function group(leads: Lead[]) {
  const overdue: Lead[] = [];
  const today: Lead[] = [];
  const soon: Lead[] = [];
  const unscheduled: Lead[] = [];

  for (const lead of leads) {
    const days = daysOverdue(lead.next_follow_up_on);
    if (days == null) unscheduled.push(lead);
    else if (days > 0) overdue.push(lead);
    else if (days === 0) today.push(lead);
    else soon.push(lead);
  }

  return [
    { key: "overdue", title: "Overdue", hint: "Past the agreed follow-up date", leads: overdue, tone: "overdue" },
    { key: "today", title: "Due today", hint: "Call these before the day ends", leads: today, tone: "today" },
    { key: "soon", title: "Next 7 days", hint: "Scheduled and coming up", leads: soon, tone: "soon" },
    { key: "unscheduled", title: "Not scheduled", hint: "Open leads with no follow-up date", leads: unscheduled, tone: "none" },
  ];
}

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const [alerts, consultants, leads] = await Promise.all([
    getFollowUpAlerts(),
    getConsultantBreakdown(),
    listLeads({ open: true, order: "follow_up", assignedTo: filters.consultant, limit: 500 }),
  ]);

  const sections = group(leads);

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Follow-ups</span>
          <h1>Who to call today</h1>
          <p>
            Every open lead with the date the consultant promised to come back to them. Overdue
            first — a lead that waits three days is a lead that buys elsewhere.
          </p>
        </div>
        <div className="dash-actions">
          <a className="dash-btn dash-btn--gold" href="/dashboard/leads/new">
            + New lead
          </a>
        </div>
      </header>

      <section className="dash-stats" aria-label="Follow-up queue">
        <div className="dash-stat" data-tone="overdue">
          <div className="dash-stat-label">Overdue</div>
          <div className="dash-stat-value">{alerts.overdue}</div>
          <div className="dash-stat-hint">needs a call now</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Due today</div>
          <div className="dash-stat-value">{alerts.dueToday}</div>
          <div className="dash-stat-hint">on schedule for today</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Next 7 days</div>
          <div className="dash-stat-value">{alerts.upcoming}</div>
          <div className="dash-stat-hint">coming up</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">No date</div>
          <div className="dash-stat-value">{alerts.unscheduled}</div>
          <div className="dash-stat-hint">open, nothing scheduled</div>
        </div>
      </section>

      {consultants.length > 1 ? (
        <form className="dash-filterbar" method="get" action="/dashboard/follow-ups">
          <label className="dash-field">
            <span>Consultant</span>
            <select className="dash-select" name="consultant" defaultValue={filters.consultant ?? ""}>
              <option value="">Everyone</option>
              {consultants
                .filter((row) => row.consultant !== "Unassigned")
                .map((row) => (
                  <option key={row.consultant} value={row.consultant}>
                    {row.consultant} · {row.due} due
                  </option>
                ))}
            </select>
          </label>
          <button type="submit" className="dash-btn">
            Filter
          </button>
          <a className="dash-btn dash-btn--quiet" href="/dashboard/follow-ups">
            Reset
          </a>
        </form>
      ) : null}

      {sections.map((section) => (
        <section className="dash-card" key={section.key} style={{ marginTop: "0.9rem" }}>
          <div className="dash-card-head">
            <h2 className="dash-card-title">
              {section.title}
              <span className="dash-count">{section.leads.length}</span>
            </h2>
            <span className="dash-card-hint">{section.hint}</span>
          </div>

          {section.leads.length ? (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Interest</th>
                    <th>Status</th>
                    <th>Follow-up</th>
                    <th>Owner</th>
                    <th>Last contact</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {section.leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <a className="cell-strong" href={`/dashboard/leads/${lead.id}`}>
                          {lead.full_name}
                        </a>
                        <span className="cell-sub">
                          {phoneDigits(lead.phone) ? lead.phone : "WhatsApp handle"}
                        </span>
                      </td>
                      <td>
                        {lead.project ?? "—"}
                        <span className="cell-sub">
                          {lead.property_type ?? "No unit type"}
                          {lead.bedrooms ? ` · ${lead.bedrooms} bed` : ""}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="cell-nowrap" data-tone={section.tone}>
                        {lead.next_follow_up_on ? (
                          <>
                            <strong>{followUpLabel(lead.next_follow_up_on)}</strong>
                            <span className="cell-sub">{formatDate(lead.next_follow_up_on)}</span>
                          </>
                        ) : (
                          <span className="cell-sub">Not scheduled</span>
                        )}
                      </td>
                      <td>{lead.assigned_to ?? <span className="cell-sub">Unassigned</span>}</td>
                      <td className="cell-nowrap">
                        {lead.last_follow_up_at ? (
                          <>
                            {timeAgo(lead.last_follow_up_at)}
                            <span className="cell-sub">{lead.follow_up_count} logged</span>
                          </>
                        ) : (
                          <span className="cell-sub">Never contacted</span>
                        )}
                      </td>
                      <td className="cell-nowrap">
                        <a className="dash-link" href={`/dashboard/leads/${lead.id}`}>
                          Log contact
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dash-card-body">
              <p className="detail-note">Nothing in this bucket.</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
