import { getPool } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pool = getPool();

  // Fetch developer info
  const { rows: devRows } = await pool.query(
    `SELECT * FROM developers WHERE slug = $1 AND published = true`,
    [slug]
  );
  if (devRows.length === 0) notFound();

  const developer = devRows[0];

  // Fetch published projects for this developer
  const { rows: projectsRows } = await pool.query(
    `SELECT p.* FROM projects p WHERE p.developer_slug = $1 AND p.published = true ORDER BY p.position, p.slug`,
    [slug]
  );

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">{developer.name}</span>
          <h1>Projects</h1>
          <p>Projects by {developer.name}</p>
        </div>
      </header>

      {projectsRows.length === 0 ? (
        <p>No published projects found for this developer.</p>
      ) : (
        <section className="dash-card" style={{ marginTop: "0.9rem" }}>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Region</th>
                </tr>
              </thead>
              <tbody>
                {projectsRows.map((project) => (
                  <tr key={project.slug}>
                    <td>
                      <a href={`/projects/${project.slug}`} className="cell-strong">
                        {project.name}
                      </a>
                      {project.name_ar && (
                        <span dir="ltr">{project.name_ar}</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`dash-pill dash-pill--${project.status === 'selling' ? 'primary' : project.status === 'completed' ? 'success' : 'info'}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td>{project.category}</td>
                    <td>{project.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
