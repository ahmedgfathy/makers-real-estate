import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function getDevelopers() {
  const pool = getPool();
  const { rows } = await pool.query(`
    SELECT d.slug, d.name, d.name_ar, d.description,
           count(p.slug)::int AS project_count,
           count(p.slug) FILTER (WHERE p.published) AS published_count
    FROM developers d
    LEFT JOIN projects p ON p.developer_slug = d.slug AND p.published = true
    WHERE d.published = true
    GROUP BY d.slug, d.name, d.name_ar, d.description
    ORDER BY d.name
  `);
  return rows;
}

export default async function DevelopersPage() {
  const developerList = await getDevelopers();

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Developers</span>
          <h1>Developer Showcase</h1>
          <p>Discover our development partners and their projects</p>
        </div>
      </header>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Developer</th>
                <th>Projects</th>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              {developerList.map((dev) => (
                <tr key={dev.slug}>
                  <td>
                    <span className="cell-strong">
                      {dev.name}{dev.name_ar && <span dir="ltr">{dev.name_ar}</span>}
                    </span>
                  </td>
                  <td>{dev.project_count}</td>
                  <td>{dev.published_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
