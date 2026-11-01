import { listDevelopers } from "@/lib/developers";
import ProjectForm from "@/components/dashboard/ProjectForm";
import { createProjectAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; developer?: string }>;
}) {
  const [developers, params] = await Promise.all([listDevelopers(), searchParams]);
  const selectedDeveloper = developers.some((developer) => developer.slug === params.developer)
    ? params.developer
    : developers[0]?.slug;

  return (
    <div className="dash-page">
      <a className="dash-back" href="/dashboard/primary">← Back to Primary</a>
      <header className="dash-head"><div><span className="dash-kicker">Primary · Project</span><h1>Add a project</h1><p>Choose its developer. Inventory units will be attached to this project.</p></div></header>
      {params.error ? <p className="dash-banner dash-banner--error" role="alert">{params.error}</p> : null}
      {!developers.length ? <section className="dash-empty"><h2>Add a developer first</h2><p>Every project belongs to one developer.</p><a className="dash-btn dash-btn--gold" href="/dashboard/developers/new">Create developer</a></section> : (
        <ProjectForm
          developers={developers}
          action={createProjectAction}
          submitLabel="Create project"
          defaultDeveloperSlug={selectedDeveloper}
        />
      )}
    </div>
  );
}
