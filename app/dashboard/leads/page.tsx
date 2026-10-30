import { getLeadStats, LEAD_SOURCES, LEAD_STATUSES, listLeads } from "@/lib/admin";
import { budget, timeAgo, titleCase } from "@/lib/format";
import { SourceBadge, StatusBadge } from "@/components/dashboard/Badges";

export const dynamic = "force-dynamic";

type Search = { q?: string; source?: string; status?: string };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const [stats, leads] = await Promise.all([
    getLeadStats(),
    listLeads({ q: filters.q, source: filters.source, status: filters.status, limit: 200 }),
  ]);

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Leads</span>
          <h1>Pipeline</h1>
          <p>
            Every enquiry from Facebook lead forms, Instagram, the website, WhatsApp and manual
            entry — with the brief the buyer asked about.
          </p>
        </div>
        <div className="dash-actions">
          <a className="dash-btn dash-btn--gold" href="/dashboard/leads/new">
            + New lead
          </a>
        </div>
      </header>

      <section className="dash-stats" aria-label="Lead totals">
        <div className="dash-stat">
          <div className="dash-stat-label">All leads</div>
          <div className="dash-stat-value">{stats.total}</div>
          <div className="dash-stat-hint">across every channel</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">New</div>
          <div className="dash-stat-value">{stats.new}</div>
          <div className="dash-stat-hint">not contacted yet</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Facebook</div>
          <div className="dash-stat-value">{stats.facebook}</div>
          <div className="dash-stat-hint">lead-ad submissions</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Qualified+</div>
          <div className="dash-stat-value">{stats.qualified}</div>
          <div className="dash-stat-hint">qualified, viewing or won</div>
        </div>
      </section>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <form className="dash-filterbar" method="get" action="/dashboard/leads">
          <label className="dash-field dash-field--grow">
            <span>Search</span>
            <input
              className="dash-input"
              type="search"
              name="q"
              placeholder="Name, phone, email or project"
              defaultValue={filters.q ?? ""}
            />
          </label>

          <label className="dash-field">
            <span>Source</span>
            <select className="dash-select" name="source" defaultValue={filters.source ?? ""}>
              <option value="">All sources</option>
              {LEAD_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {titleCase(source)}
                </option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>Status</span>
            <select className="dash-select" name="status" defaultValue={filters.status ?? ""}>
              <option value="">All statuses</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {titleCase(status)}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="dash-btn">
            Filter
          </button>
          <a className="dash-btn dash-btn--quiet" href="/dashboard/leads">
            Reset
          </a>
        </form>

        {leads.length ? (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Source</th>
                  <th>Interest</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <a className="cell-strong" href={`/dashboard/leads/${lead.id}`}>
                        {lead.full_name}
                      </a>
                      <span className="cell-sub">
                        {lead.phone}
                        {lead.email ? ` · ${lead.email}` : ""}
                      </span>
                    </td>
                    <td>
                      <SourceBadge source={lead.source} />
                      {lead.form_name ? <span className="cell-sub">{lead.form_name}</span> : null}
                    </td>
                    <td>
                      {lead.project ?? "—"}
                      <span className="cell-sub">
                        {lead.property_type ?? "No unit type"}
                        {lead.bedrooms ? ` · ${lead.bedrooms} bed` : ""}
                      </span>
                    </td>
                    <td className="cell-num">{budget(lead.budget_min, lead.budget_max)}</td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="cell-nowrap">{timeAgo(lead.created_at)}</td>
                    <td className="cell-nowrap">
                      <a className="dash-link" href={`/dashboard/leads/${lead.id}`}>
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dash-empty">
            <div className="dash-empty-icon">◎</div>
            <h3>No leads match</h3>
            <p>Clear the filters or add the first lead manually.</p>
            <a className="dash-btn" href="/dashboard/leads">
              Clear filters
            </a>
          </div>
        )}
      </section>

      <p className="dash-note" style={{ marginTop: "0.9rem" }}>
        Facebook / Instagram lead-ad forms can post directly to <code>/api/leads</code>. The endpoint
        accepts the standard <code>field_data</code> payload and stores the lead with source{" "}
        <code>facebook</code>.
      </p>
    </div>
  );
}
