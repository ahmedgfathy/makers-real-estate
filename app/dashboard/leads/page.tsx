import {
  getLeadStats,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_TEMPERATURES,
  listLeads,
} from "@/lib/admin";
import { ancestorLocations, getCatalogOptions, projectName } from "@/lib/catalog";
import { budget, phoneDigits, timeAgo, titleCase } from "@/lib/format";
import { importLeadsAction } from "./actions";
import { FollowUpBadge, SourceBadge, StatusBadge, TemperatureBadge } from "@/components/dashboard/Badges";

export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  source?: string;
  status?: string;
  temperature?: string;
  locationId?: string;
  projectId?: string;
  categoryId?: string;
  unitId?: string;
  followUp?: string;
  notice?: string;
  tone?: string;
};

const FOLLOW_UP_FILTERS = [
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "due", label: "Due today or earlier" },
  { value: "none", label: "Not scheduled" },
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const [stats, leads, options] = await Promise.all([
    getLeadStats(),
    listLeads({
      q: filters.q,
      source: filters.source,
      status: filters.status,
      temperature: filters.temperature,
      locationId: filters.locationId,
      projectId: filters.projectId,
      categoryId: filters.categoryId,
      unitId: filters.unitId,
      followUp: filters.followUp,
      limit: 500,
    }),
    getCatalogOptions(),
  ]);
  const locationLabel = (id: string) => {
    const location = options.locations.find((item) => item.id === id);
    return location
      ? [...ancestorLocations(options.locations, location), location].map((item) => item.nameEn).join(" / ")
      : id;
  };

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Leads</span>
          <h1>Pipeline</h1>
          <p>
            Every enquiry from Facebook lead forms, the website, WhatsApp, referrals and manual
            entry — with the brief the buyer asked about and who owns the follow-up.
          </p>
        </div>
        <div className="dash-actions">
          <form action={importLeadsAction} className="dash-import">
            <label className="dash-filepicker">
              <input type="file" name="csv" accept=".csv,text/csv" required />
              <span>Choose CSV</span>
            </label>
            <button className="dash-btn" type="submit">
              Import leads
            </button>
          </form>
          <a className="dash-btn dash-btn--gold" href="/dashboard/leads/new">
            + New lead
          </a>
        </div>
      </header>

      {filters.notice ? (
        <p
          className={filters.tone === "ok" ? "dash-alert dash-alert--ok" : "dash-alert"}
          style={{ marginBottom: "0.9rem" }}
        >
          {filters.notice}
        </p>
      ) : null}

      <section className="dash-stats" aria-label="Lead totals">
        <div className="dash-stat">
          <div className="dash-stat-label">All leads</div>
          <div className="dash-stat-value">{stats.total}</div>
          <div className="dash-stat-hint">across every channel</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Open</div>
          <div className="dash-stat-value">{stats.open}</div>
          <div className="dash-stat-hint">not won or lost</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Hot</div>
          <div className="dash-stat-value">{stats.hot}</div>
          <div className="dash-stat-hint">marked hot and still open</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Unassigned</div>
          <div className="dash-stat-value">{stats.unassigned}</div>
          <div className="dash-stat-hint">no consultant yet</div>
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
              placeholder="Name, phone, notes or project"
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

          <label className="dash-field">
            <span>Temperature</span>
            <select className="dash-select" name="temperature" defaultValue={filters.temperature ?? ""}>
              <option value="">Any</option>
              {LEAD_TEMPERATURES.map((temperature) => (
                <option key={temperature} value={temperature}>
                  {titleCase(temperature)}
                </option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>Location</span>
            <select className="dash-select" name="locationId" defaultValue={filters.locationId ?? ""}>
              <option value="">All locations</option>
              {options.locations.map((location) => (
                <option key={location.id} value={location.id}>{locationLabel(location.id)}</option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>Project</span>
            <select className="dash-select" name="projectId" defaultValue={filters.projectId ?? ""}>
              <option value="">All projects</option>
              {options.projects.map((project) => (
                <option key={project.id} value={project.id}>{projectName(project, "en")}</option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>Category</span>
            <select className="dash-select" name="categoryId" defaultValue={filters.categoryId ?? ""}>
              <option value="">All categories</option>
              {options.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.nameEn}</option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>Follow-up</span>
            <select className="dash-select" name="followUp" defaultValue={filters.followUp ?? ""}>
              <option value="">Any</option>
              {FOLLOW_UP_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
                  <th>Heat</th>
                  <th>Status</th>
                  <th>Follow-up</th>
                  <th>Owner</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const classified = [
                    lead.location_id ? locationLabel(lead.location_id) : "",
                    lead.project_id ? options.projects.find((item) => item.id === lead.project_id)?.nameEn ?? "" : "",
                    lead.property_category_id ? options.categories.find((item) => item.id === lead.property_category_id)?.nameEn ?? "" : "",
                  ].filter(Boolean).join(" · ");
                  return (
                  <tr key={lead.id}>
                    <td>
                      <a className="cell-strong" href={`/dashboard/leads/${lead.id}`}>
                        {lead.full_name}
                      </a>
                      <span className="cell-sub">
                        {phoneDigits(lead.phone) ? lead.phone : "WhatsApp handle"}
                        {lead.email ? ` · ${lead.email}` : ""}
                      </span>
                    </td>
                    <td>
                      <SourceBadge source={lead.source} />
                      <span className="cell-sub">{timeAgo(lead.created_at)}</span>
                    </td>
                    <td>
                      {classified || lead.project || "—"}
                      <span className="cell-sub">
                        {lead.property_type ?? "No unit type"}
                        {lead.bedrooms ? ` · ${lead.bedrooms} bed` : ""}
                        {lead.preferred_area ? ` · ${lead.preferred_area}` : ""}
                      </span>
                    </td>
                    <td className="cell-num">{budget(lead.budget_min, lead.budget_max)}</td>
                    <td>
                      <TemperatureBadge temperature={lead.temperature} />
                    </td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="cell-nowrap">
                      <FollowUpBadge date={lead.next_follow_up_on} />
                      {lead.follow_up_count > 0 ? (
                        <span className="cell-sub">{lead.follow_up_count} logged</span>
                      ) : null}
                    </td>
                    <td>{lead.assigned_to ?? <span className="cell-sub">Unassigned</span>}</td>
                    <td className="cell-nowrap">
                      <a className="dash-link" href={`/dashboard/leads/${lead.id}`}>
                        Open
                      </a>
                    </td>
                  </tr>
                  );
                })}
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
