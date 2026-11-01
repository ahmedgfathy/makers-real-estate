import { createDeveloperAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewDeveloperPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="dash-page">
      <a className="dash-back" href="/dashboard/primary">← Back to Primary</a>
      <header className="dash-head">
        <div><span className="dash-kicker">Primary · Developer</span><h1>Add a developer</h1><p>Create a developer profile, then add its projects and inventory units.</p></div>
      </header>
      {error ? <p className="dash-banner dash-banner--error" role="alert">{error}</p> : null}
      <form className="dash-form" action={createDeveloperAction}>
        <section className="dash-form-section">
          <h2>Developer profile</h2>
          <div className="dash-form-grid">
            <label className="dash-field"><span>Name *</span><input className="dash-input" name="name" required placeholder="e.g. SODIC" /></label>
            <label className="dash-field"><span>URL slug (optional)</span><input className="dash-input" name="slug" placeholder="Generated from the name" /></label>
            <label className="dash-field"><span>Arabic name</span><input className="dash-input" name="name_ar" dir="rtl" /></label>
            <label className="dash-field"><span>Established</span><input className="dash-input" name="established" type="number" min="1800" max="2100" /></label>
            <label className="dash-field span-2"><span>Website</span><input className="dash-input" name="website" type="url" placeholder="https://" /></label>
            <label className="dash-field span-2"><span>Description</span><textarea className="dash-textarea" name="description" /></label>
            <label className="dash-field span-2"><span>Arabic description</span><textarea className="dash-textarea" name="description_ar" dir="rtl" /></label>
          </div>
        </section>
        <div className="dash-form-actions">
          <button className="dash-btn dash-btn--gold" type="submit">Create developer</button>
          <a className="dash-btn dash-btn--quiet" href="/dashboard/primary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
