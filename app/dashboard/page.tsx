import {
  getConsultantBreakdown,
  getDueFollowUps,
  getFollowUpAlerts,
  getLeadSourceBreakdown,
  getLeadStats,
  listLeads,
} from "@/lib/admin";
import { formatDate, phoneDigits, timeAgo, titleCase } from "@/lib/format";
import { FollowUpBadge, SourceBadge, StatusBadge } from "@/components/dashboard/Badges";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [leadStats, recentLeads, sources, alerts, due, consultants] = await Promise.all([
    getLeadStats(),
    listLeads({ limit: 8 }),
    getLeadSourceBreakdown(),
    getFollowUpAlerts(),
    getDueFollowUps(6),
    getConsultantBreakdown(),
  ]);

  const sourceMax = Math.max(1, ...sources.map((source) => source.count));
  const dueNow = alerts.overdue + alerts.dueToday;

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Overview</span>
          <h1>Welcome back.</h1>
          <p>Review enquiries and keep track of your sales pipeline.</p>
        </div>
        <div className="dash-actions">
          <a className="dash-btn" href="/" target="_blank" rel="noopener noreferrer">
            View live site ↗
          </a>
          <a className="dash-btn dash-btn--gold" href="/dashboard/leads/new">
            + New lead
          </a>
        </div>
      </header>

      {dueNow > 0 ? (
        <a className="dash-notice" href="/dashboard/follow-ups">
          <strong>
            {alerts.overdue > 0
              ? `${alerts.overdue} follow-up${alerts.overdue === 1 ? "" : "s"} overdue`
              : `${alerts.dueToday} follow-up${alerts.dueToday === 1 ? "" : "s"} due today`}
          </strong>
          <span>
            {alerts.overdue > 0 && alerts.dueToday > 0
              ? `· ${alerts.dueToday} more due today`
              : "· nobody has been called back past their promised date"}
          </span>
          <em>Open the queue →</em>
        </a>
      ) : null}

      <section className="dash-stats" aria-label="Lead pipeline">
        <div className="dash-stat">
          <div className="dash-stat-label">Total leads</div>
          <div className="dash-stat-value">{leadStats.total}</div>
          <div className="dash-stat-hint">Across every channel</div>
        </div>
        <div className="dash-stat" data-tone={dueNow > 0 ? "overdue" : undefined}>
          <div className="dash-stat-label">Follow-ups due</div>
          <div className="dash-stat-value">{dueNow}</div>
          <div className="dash-stat-hint">
            {alerts.overdue} overdue · {alerts.dueToday} today
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Hot &amp; open</div>
          <div className="dash-stat-value">{leadStats.hot}</div>
          <div className="dash-stat-hint">Rated hot, not won or lost</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Unassigned</div>
          <div className="dash-stat-value">{leadStats.unassigned}</div>
          <div className="dash-stat-hint">Open leads without a consultant</div>
        </div>
      </section>

      <div className="dash-grid">
        <section className="dash-card" aria-labelledby="follow-ups">
          <div className="dash-card-head">
            <h2 className="dash-card-title" id="follow-ups">
              Call back today
            </h2>
            <a className="dash-link" href="/dashboard/follow-ups">View queue →</a>
          </div>
          {due.length ? (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>Lead</th><th>Owner</th><th>Status</th><th>Due</th></tr>
                </thead>
                <tbody>
                  {due.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <a className="cell-strong" href={`/dashboard/leads/${lead.id}`}>{lead.full_name}</a>
                        <span className="cell-sub">
                          {phoneDigits(lead.phone) ? lead.phone : "WhatsApp handle"}
                        </span>
                      </td>
                      <td>{lead.assigned_to ?? <span className="cell-sub">Unassigned</span>}</td>
                      <td><StatusBadge status={lead.status} /></td>
                      <td className="cell-nowrap">
                        <FollowUpBadge date={lead.next_follow_up_on} />
                        <span className="cell-sub">{formatDate(lead.next_follow_up_on)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dash-empty">
              <div className="dash-empty-icon">✓</div>
              <h3>Queue is clear</h3>
              <p>Nothing is overdue and nothing is due today. New enquiries appear here as they land.</p>
            </div>
          )}
        </section>

        <section className="dash-card" aria-labelledby="consultants">
          <div className="dash-card-head">
            <h2 className="dash-card-title" id="consultants">Consultants</h2>
          </div>
          <div className="dash-card-body">
            {consultants.length ? (
              <div className="source-list">
                {consultants.map((row) => (
                  <div className="source-row" key={row.consultant}>
                    <div className="source-row-head">
                      <span>{row.consultant}</span>
                      <strong>{row.due ? `${row.due} due` : row.count}</strong>
                    </div>
                    <div className="source-bar">
                      <span style={{ width: `${Math.round((row.count / Math.max(1, consultants[0].count)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="detail-note">No leads assigned yet.</p>}
          </div>
        </section>
      </div>

      <div className="dash-grid">
        <section className="dash-card" aria-labelledby="recent-leads">
          <div className="dash-card-head">
            <h2 className="dash-card-title" id="recent-leads">Latest leads</h2>
            <a className="dash-link" href="/dashboard/leads">View all →</a>
          </div>
          {recentLeads.length ? (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>Lead</th><th>Source</th><th>Interest</th><th>Status</th><th>Received</th></tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <a className="cell-strong" href={`/dashboard/leads/${lead.id}`}>{lead.full_name}</a>
                        <span className="cell-sub">
                          {phoneDigits(lead.phone) ? lead.phone : "WhatsApp handle"}
                        </span>
                      </td>
                      <td><SourceBadge source={lead.source} /></td>
                      <td>
                        {lead.project ?? "—"}
                        <span className="cell-sub">
                          {lead.property_type ?? "No unit type"}{lead.bedrooms ? ` · ${lead.bedrooms} bed` : ""}
                        </span>
                      </td>
                      <td><StatusBadge status={lead.status} /></td>
                      <td className="cell-nowrap">{timeAgo(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dash-empty">
              <div className="dash-empty-icon">◎</div>
              <h3>No leads yet</h3>
              <p>Add a lead manually or send a Facebook lead form payload to /api/leads.</p>
            </div>
          )}
          <div className="dash-card-foot">
            <a className="dash-link" href="/dashboard/leads/new">Add a lead manually →</a>
          </div>
        </section>

        <section className="dash-card" aria-labelledby="sources">
          <div className="dash-card-head">
            <h2 className="dash-card-title" id="sources">Lead sources</h2>
          </div>
          <div className="dash-card-body">
            {sources.length ? (
              <div className="source-list">
                {sources.map((source) => (
                  <div className="source-row" key={source.source}>
                    <div className="source-row-head"><span>{titleCase(source.source)}</span><strong>{source.count}</strong></div>
                    <div className="source-bar">
                      <span style={{ width: `${Math.round((source.count / sourceMax) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="detail-note">No lead sources recorded yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
