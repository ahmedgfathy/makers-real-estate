import { notFound } from "next/navigation";
import { getProperty, PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/admin";
import { listProjects } from "@/lib/projects";
import { titleCase } from "@/lib/format";
import { updatePropertyAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditUnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, notices] = await Promise.all([params, searchParams]);
  const unitId = Number(id);
  if (!Number.isInteger(unitId)) notFound();
  const [unit, projects] = await Promise.all([getProperty(unitId), listProjects()]);
  if (!unit) notFound();

  return (
    <div className="dash-page">
      <a className="dash-back" href={`/dashboard/inventory/${unit.id}`}>← Back to unit</a>
      <header className="dash-head"><div><span className="dash-kicker">Unit · {unit.code}</span><h1>Edit unit</h1><p>Update its project, specifications, pricing and website visibility.</p></div></header>
      {notices.error ? <p className="dash-banner dash-banner--error" role="alert">{notices.error}</p> : null}
      <form className="dash-form" action={updatePropertyAction}>
        <input type="hidden" name="id" value={unit.id} />
        <section className="dash-form-section"><h2>Project &amp; identity</h2><div className="dash-form-grid">
          <label className="dash-field"><span>Project *</span><select className="dash-select" name="project_slug" required defaultValue={unit.project_slug ?? ""}><option value="" disabled>Select a project</option>{projects.map((project) => <option key={project.slug} value={project.slug}>{project.developerName} · {project.name}</option>)}</select></label>
          <label className="dash-field"><span>Unit code *</span><input className="dash-input" name="code" required defaultValue={unit.code} /></label>
          <label className="dash-field span-2"><span>Title *</span><input className="dash-input" name="title" required defaultValue={unit.title} /></label>
          <label className="dash-field"><span>Phase</span><input className="dash-input" name="phase" defaultValue={unit.phase ?? ""} /></label>
          <label className="dash-field"><span>Property type</span><select className="dash-select" name="property_type" defaultValue={unit.property_type}>{PROPERTY_TYPES.map((type) => <option key={type} value={type}>{titleCase(type)}</option>)}</select></label>
          <label className="dash-field"><span>Listing type</span><select className="dash-select" name="listing_type" defaultValue={unit.listing_type}><option value="sale">Sale</option><option value="resale">Resale</option><option value="rent">Rent</option></select></label>
          <label className="dash-field"><span>Status</span><select className="dash-select" name="status" defaultValue={unit.status}>{PROPERTY_STATUSES.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}</select></label>
          <label className="dash-check"><input type="checkbox" name="featured" defaultChecked={unit.featured} />Featured unit</label>
          <label className="dash-check"><input type="checkbox" name="published" defaultChecked={unit.published} />Publish unit to website</label>
        </div></section>
        <section className="dash-form-section"><h2>Specification</h2><div className="dash-form-grid">
          <label className="dash-field"><span>Bedrooms</span><input className="dash-input" type="number" min="0" name="bedrooms" defaultValue={unit.bedrooms ?? ""} /></label>
          <label className="dash-field"><span>Bathrooms</span><input className="dash-input" type="number" min="0" name="bathrooms" defaultValue={unit.bathrooms ?? ""} /></label>
          <label className="dash-field"><span>Built-up area (m²)</span><input className="dash-input" type="number" min="0" step="0.01" name="built_up_area" defaultValue={unit.built_up_area ?? ""} /></label>
          <label className="dash-field"><span>Garden area (m²)</span><input className="dash-input" type="number" min="0" step="0.01" name="garden_area" defaultValue={unit.garden_area ?? ""} /></label>
          <label className="dash-field"><span>Roof area (m²)</span><input className="dash-input" type="number" min="0" step="0.01" name="roof_area" defaultValue={unit.roof_area ?? ""} /></label>
          <label className="dash-field"><span>Floor</span><input className="dash-input" name="floor" defaultValue={unit.floor ?? ""} /></label>
          <label className="dash-field"><span>Finishing</span><input className="dash-input" name="finishing" defaultValue={unit.finishing ?? ""} /></label>
          <label className="dash-field"><span>View</span><input className="dash-input" name="view" defaultValue={unit.view ?? ""} /></label>
        </div></section>
        <section className="dash-form-section"><h2>Pricing &amp; delivery</h2><div className="dash-form-grid">
          <label className="dash-field"><span>Price (EGP) *</span><input className="dash-input" type="number" min="0" step="1000" required name="price" defaultValue={unit.price} /></label>
          <label className="dash-field"><span>Down payment</span><input className="dash-input" type="number" min="0" step="1000" name="down_payment" defaultValue={unit.down_payment} /></label>
          <label className="dash-field"><span>Installment years</span><input className="dash-input" type="number" min="1" max="30" name="installment_years" defaultValue={unit.installment_years} /></label>
          <label className="dash-field"><span>Monthly installment</span><input className="dash-input" type="number" min="0" name="monthly_installment" defaultValue={unit.monthly_installment ?? ""} /></label>
          <label className="dash-field"><span>Delivery</span><input className="dash-input" name="delivery" defaultValue={unit.delivery ?? ""} /></label>
        </div></section>
        <section className="dash-form-section"><h2>Media &amp; description</h2><div className="dash-form-grid">
          <label className="dash-field span-2"><span>Image paths (one per line)</span><textarea className="dash-textarea" name="images" defaultValue={unit.images.join("\n")} /></label>
          <label className="dash-field span-2"><span>Video path</span><input className="dash-input" name="video" defaultValue={unit.video ?? ""} /></label>
          <label className="dash-field span-2"><span>Amenities (one per line)</span><textarea className="dash-textarea" name="amenities" defaultValue={unit.amenities.join("\n")} /></label>
          <label className="dash-field span-2"><span>Description</span><textarea className="dash-textarea" name="description" defaultValue={unit.description ?? ""} /></label>
        </div></section>
        <div className="dash-form-actions"><button className="dash-btn dash-btn--gold" type="submit">Save unit</button><a className="dash-btn dash-btn--quiet" href={`/dashboard/inventory/${unit.id}`}>Cancel</a></div>
      </form>
    </div>
  );
}
