import { getSite } from "@/lib/content-db";
import {
  getLeadSourceBreakdown,
  getLeadStats,
  getPropertyStats,
  listLeads,
  listProperties,
} from "@/lib/admin";
import { egp, timeAgo } from "@/lib/format";
import { SourceBadge, StatusBadge } from "@/components/dashboard/Badges";
import PropertyCard from "@/components/dashboard/PropertyCard";
import { canPublish, getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const [leadStats, propertyStats, recentLeads, sources, featured, site] = await Promise.all([
    getLeadStats(),
    getPropertyStats(),
    listLeads({ limit: 5 }),
    getLeadSourceBreakdown(),
    listProperties({ limit: 3 }),
    getSite(),
  ]);

  const sourceMax = Math.max(1, ...sources.map((source) => source.count));
  const tiles = site.content.en.tiles.length;

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Overview</span>
          <h1>Welcome back, admin.</h1>
          <p>
            Leads, project content and live inventory for The Lakes at SODIC East — all in one
            place.
          </p>
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

      <section className="dash-stats" aria-label="Key figures">
        <div className="dash-stat">
          <div className="dash-stat-label">Total leads</div>
          <div className="dash-stat-value">{leadStats.total}</div>
          <div className="dash-stat-hint">
            <strong>{leadStats.new}</strong> waiting for first contact
          </div>
        </div>

        <div className="dash-stat">
          <div className="dash-stat-label">Facebook leads</div>
          <div className="dash-stat-value">{leadStats.facebook}</div>
          <div className="dash-stat-hint">
            <strong>{leadStats.qualified}</strong> qualified or beyond
          </div>
        </div>

        <div className="dash-stat">
          <div className="dash-stat-label">Available units</div>
          <div className="dash-stat-value">{propertyStats.available}</div>
          <div className="dash-stat-hint">
            of <strong>{propertyStats.total}</strong> properties in the inventory
          </div>
        </div>

        <div className="dash-stat">
          <div className="dash-stat-label">Inventory value</div>
          <div className="dash-stat-value">{egp(propertyStats.value, true)}</div>
          <div className="dash-stat-hint">
            <strong>{propertyStats.featured}</strong> featured listings
          </div>
        </div>
      </section>

      <div className="dash-grid">
        <section className="dash-card" aria-labelledby="recent-leads">
          <div className="dash-card-head">
            <h2 className="dash-card-title" id="recent-leads">
              Latest leads
            </h2>
            <a className="dash-link" href="/dashboard/leads">
              View all →
            </a>
          </div>

          {recentLeads.length ? (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Source</th>
                    <th>Interest</th>
                    <th>Status</th>
                    <th>Received</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <a className="cell-strong" href={`/dashboard/leads/${lead.id}`}>
                          {lead.full_name}
                        </a>
                        <span className="cell-sub">{lead.phone}</span>
                      </td>
                      <td>
                        <SourceBadge source={lead.source} />
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
            <a className="dash-link" href="/dashboard/leads/new">
              Add a lead manually →
            </a>
          </div>
        </section>

        <div className="detail-side">
          <section className="dash-card" aria-labelledby="sources">
            <div className="dash-card-head">
              <h2 className="dash-card-title" id="sources">
                Lead sources
              </h2>
            </div>
            <div className="dash-card-body">
              {sources.length ? (
                <div className="source-list">
                  {sources.map((source) => (
                    <div className="source-row" key={source.source}>
                      <div className="source-row-head">
                        <span>{source.source}</span>
                        <strong>{source.count}</strong>
                      </div>
                      <div className="source-bar">
                        <span style={{ width: `${Math.round((source.count / sourceMax) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="detail-note">No lead sources recorded yet.</p>
              )}
            </div>
          </section>

          <section className="dash-card" aria-labelledby="content-snapshot">
            <div className="dash-card-head">
              <h2 className="dash-card-title" id="content-snapshot">
                Primary
              </h2>
              <a className="dash-link" href="/dashboard/primary">
                Open →
              </a>
            </div>
            <div className="dash-card-body">
              <div className="dash-meta-row">
                <span>
                  <strong>{tiles}</strong> tiles
                </span>
                <span>
                  <strong>{Object.keys(site.content).length}</strong> locales
                </span>
                <span>
                  Source: <strong>PostgreSQL</strong>
                </span>
              </div>
              <p className="detail-note" style={{ marginTop: "0.8rem" }}>
                Fact sheet, collection panels and contact details, seeded from{" "}
                <code>data/content.ts</code>.
              </p>
            </div>
          </section>
        </div>
      </div>

      <section className="dash-card" aria-labelledby="featured" style={{ marginTop: "0.9rem" }}>
        <div className="dash-card-head">
          <h2 className="dash-card-title" id="featured">
            Featured inventory
          </h2>
          <a className="dash-link" href="/dashboard/inventory">
            View inventory →
          </a>
        </div>
        <div className="dash-card-body">
          {featured.length ? (
            <div className="inv-grid">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} canPublish={canPublish(session)} />
              ))}
            </div>
          ) : (
            <p className="detail-note">No properties in the inventory yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
