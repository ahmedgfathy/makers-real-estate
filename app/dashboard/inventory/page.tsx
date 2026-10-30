import {
  getPropertyStats,
  listProperties,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from "@/lib/admin";
import { canPublish, getSession } from "@/lib/auth";
import { egp, titleCase } from "@/lib/format";
import PropertyCard from "@/components/dashboard/PropertyCard";

export const dynamic = "force-dynamic";

type Search = { q?: string; status?: string; type?: string };

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const mayPublish = canPublish(await getSession());
  const [stats, properties] = await Promise.all([
    getPropertyStats(),
    listProperties({
      q: filters.q,
      status: filters.status,
      type: filters.type,
      limit: 300,
    }),
  ]);

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Inventory</span>
          <h1>Property inventory</h1>
          <p>
            Standard unit data — code, type, areas, finishing, price, payment plan, delivery and
            media. Every listing carries its own image set and optional video.
          </p>
        </div>
        <div className="dash-actions">
          <a className="dash-btn dash-btn--gold" href="/dashboard/inventory/new">
            + Add property
          </a>
        </div>
      </header>

      <section className="dash-stats" aria-label="Inventory totals">
        <div className="dash-stat">
          <div className="dash-stat-label">Properties</div>
          <div className="dash-stat-value">{stats.total}</div>
          <div className="dash-stat-hint">all phases</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Available</div>
          <div className="dash-stat-value">{stats.available}</div>
          <div className="dash-stat-hint">ready to sell</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Published</div>
          <div className="dash-stat-value">{stats.published}</div>
          <div className="dash-stat-hint">live on /properties</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Portfolio value</div>
          <div className="dash-stat-value">{egp(stats.value, true)}</div>
          <div className="dash-stat-hint">sum of listed prices</div>
        </div>
      </section>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <form className="dash-filterbar" method="get" action="/dashboard/inventory">
          <label className="dash-field dash-field--grow">
            <span>Search</span>
            <input
              className="dash-input"
              type="search"
              name="q"
              placeholder="Code, title, project or phase"
              defaultValue={filters.q ?? ""}
            />
          </label>

          <label className="dash-field">
            <span>Status</span>
            <select className="dash-select" name="status" defaultValue={filters.status ?? ""}>
              <option value="">All statuses</option>
              {PROPERTY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {titleCase(status)}
                </option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>Type</span>
            <select className="dash-select" name="type" defaultValue={filters.type ?? ""}>
              <option value="">All types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {titleCase(type)}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="dash-btn">
            Filter
          </button>
          <a className="dash-btn dash-btn--quiet" href="/dashboard/inventory">
            Reset
          </a>
        </form>

        <div className="dash-card-body">
          {properties.length ? (
            <div className="inv-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} canPublish={mayPublish} />
              ))}
            </div>
          ) : (
            <div className="dash-empty">
              <div className="dash-empty-icon">⌂</div>
              <h3>No properties match</h3>
              <p>Reset the filters or add a unit to the inventory.</p>
              <a className="dash-btn" href="/dashboard/inventory/new">
                Add property
              </a>
            </div>
          )}
        </div>
      </section>

      <p className="dash-note" style={{ marginTop: "0.9rem" }}>
        Media paths are served from <code>/public</code>. Use <code>/img/…jpg</code> for stills and{" "}
        <code>/video/hero.mp4</code> for the project film.
      </p>
    </div>
  );
}
