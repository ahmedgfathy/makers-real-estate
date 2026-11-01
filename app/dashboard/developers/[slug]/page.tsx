import { notFound } from "next/navigation";
import { canPublish, getSession } from "@/lib/auth";
import { getDeveloper } from "@/lib/developers";
import { listProjects } from "@/lib/projects";
import PublishToggle from "@/components/dashboard/PublishToggle";
import { updateDeveloperAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function DeveloperDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const [{ slug }, notices] = await Promise.all([params, searchParams]);
  const [developer, projects] = await Promise.all([getDeveloper(slug), listProjects({ developerSlug: slug })]);
  if (!developer) notFound();
  const mayPublish = canPublish(await getSession());

  return (
    <div className="dash-page">
      <a className="dash-back" href="/dashboard/primary">← Back to Primary portfolio</a>
      <header className="dash-head">
        <div><span className="dash-kicker">Developer · {projects.length} projects</span><h1>{developer.name}</h1><p>{developer.description || "Manage this developer, its projects and the units shown on the website."}</p></div>
        <div className="dash-actions">
          <PublishToggle kind="developer" id={developer.slug} published={developer.published} canPublish={mayPublish} />
          <a className="dash-btn dash-btn--gold" href={`/dashboard/projects/new?developer=${encodeURIComponent(developer.slug)}`}>+ Add project</a>
        </div>
      </header>
      {notices.error ? <p className="dash-banner dash-banner--error" role="alert">{notices.error}</p> : null}
      {notices.ok ? <p className="dash-banner dash-banner--ok" role="status">{notices.ok}</p> : null}

      <section className="dash-card" style={{ marginBottom: "1rem" }}>
        <div className="dash-card-head"><h2 className="dash-card-title">Edit developer profile</h2><span className="dash-meta-row">/{developer.slug}</span></div>
        <div className="dash-card-body">
          <form className="dash-form" action={updateDeveloperAction}>
            <input type="hidden" name="slug" value={developer.slug} />
            <div className="dash-form-grid">
              <label className="dash-field"><span>Name *</span><input className="dash-input" name="name" required defaultValue={developer.name} /></label>
              <label className="dash-field"><span>Arabic name</span><input className="dash-input" name="name_ar" dir="rtl" defaultValue={developer.name_ar ?? ""} /></label>
              <label className="dash-field"><span>Established</span><input className="dash-input" name="established" type="number" min="1800" max="2100" defaultValue={developer.established ?? ""} /></label>
              <label className="dash-field"><span>Website</span><input className="dash-input" name="website" type="url" defaultValue={developer.website ?? ""} /></label>
              <label className="dash-field span-2"><span>Description</span><textarea className="dash-textarea" name="description" defaultValue={developer.description ?? ""} /></label>
              <label className="dash-field span-2"><span>Arabic description</span><textarea className="dash-textarea" name="description_ar" dir="rtl" defaultValue={developer.description_ar ?? ""} /></label>
            </div>
            <div className="dash-form-actions"><button className="dash-btn dash-btn--gold" type="submit">Save developer</button></div>
          </form>
        </div>
      </section>

      <section className="dash-card">
        <div className="dash-card-head"><h2 className="dash-card-title">Projects · {projects.length}</h2><a className="dash-link" href={`/dashboard/projects/new?developer=${encodeURIComponent(developer.slug)}`}>Add project →</a></div>
        {projects.length ? <div className="dash-card-body"><div className="project-index">
          {projects.map((project) => <a className="project-index-row" key={project.slug} href={`/dashboard/projects/${project.slug}`}><strong>{project.name}</strong><em>{project.location} · {project.published ? "Published" : "Draft"}</em><span>Open →</span></a>)}
        </div></div> : <div className="dash-empty"><p>No projects yet. Add the developer’s first project.</p></div>}
      </section>
    </div>
  );
}
