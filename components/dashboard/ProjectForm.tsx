import { CATEGORIES, REGIONS, STATUSES, type Project } from "@/lib/projects";
import type { Developer } from "@/lib/developers";

export default function ProjectForm({
  developers,
  project,
  defaultDeveloperSlug,
  action,
  submitLabel,
}: {
  developers: Developer[];
  project?: Project;
  defaultDeveloperSlug?: string;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form className="dash-form" action={action}>
      {project ? <input type="hidden" name="slug" value={project.slug} /> : null}
      <section className="dash-form-section">
        <h2>Project details</h2>
        <div className="dash-form-grid">
          {!project ? <label className="dash-field"><span>Project URL slug (optional)</span><input className="dash-input" name="slug" placeholder="Generated from project name" /></label> : null}
          <label className="dash-field"><span>Developer *</span><select className="dash-select" name="developer_slug" required defaultValue={project?.developerSlug ?? defaultDeveloperSlug ?? developers[0]?.slug ?? ""}>
            <option value="" disabled>Select a developer</option>
            {developers.map((developer) => <option key={developer.slug} value={developer.slug}>{developer.name}</option>)}
          </select></label>
          <label className="dash-field"><span>Project name *</span><input className="dash-input" name="name" required defaultValue={project?.name ?? ""} /></label>
          <label className="dash-field"><span>Arabic name</span><input className="dash-input" name="name_ar" dir="rtl" defaultValue={project?.nameAr ?? ""} /></label>
          <label className="dash-field"><span>Region</span><select className="dash-select" name="region" defaultValue={project?.region ?? "east-cairo"}>
            {Object.entries(REGIONS).map(([value, label]) => <option key={value} value={value}>{label.en}</option>)}
          </select></label>
          <label className="dash-field"><span>Location *</span><input className="dash-input" name="location" required defaultValue={project?.location ?? ""} placeholder="City, district" /></label>
          <label className="dash-field"><span>Category</span><select className="dash-select" name="category" defaultValue={project?.category ?? "residential"}>
            {Object.entries(CATEGORIES).map(([value, label]) => <option key={value} value={value}>{label.en}</option>)}
          </select></label>
          <label className="dash-field"><span>Status</span><select className="dash-select" name="status" defaultValue={project?.status ?? "selling"}>
            {Object.entries(STATUSES).map(([value, label]) => <option key={value} value={value}>{label.en}</option>)}
          </select></label>
          <label className="dash-field"><span>Starting price (EGP)</span><input className="dash-input" name="price_from" type="number" min="0" step="1000" defaultValue={project?.priceFrom ?? ""} /></label>
          <label className="dash-field"><span>Finishing</span><input className="dash-input" name="finishing" defaultValue={project?.finishing ?? ""} /></label>
          <label className="dash-field"><span>Payment plan</span><input className="dash-input" name="payment_plan" defaultValue={project?.paymentPlan ?? ""} /></label>
          <label className="dash-field"><span>Payment plan (Arabic)</span><input className="dash-input" name="payment_plan_ar" dir="rtl" defaultValue={project?.paymentPlanAr ?? ""} /></label>
          <label className="dash-field span-2"><span>Tagline</span><input className="dash-input" name="tagline" defaultValue={project?.tagline ?? ""} /></label>
          <label className="dash-field span-2"><span>Tagline (Arabic)</span><input className="dash-input" name="tagline_ar" dir="rtl" defaultValue={project?.taglineAr ?? ""} /></label>
          <label className="dash-field span-2"><span>Description *</span><textarea className="dash-textarea" name="description" required defaultValue={project?.description ?? ""} /></label>
          <label className="dash-field span-2"><span>Description (Arabic)</span><textarea className="dash-textarea" name="description_ar" dir="rtl" defaultValue={project?.descriptionAr ?? ""} /></label>
          <label className="dash-field span-2"><span>Cover image path</span><input className="dash-input" name="hero_image" defaultValue={project?.heroImage ?? ""} placeholder="/img/project.jpg" /></label>
        </div>
      </section>
      <div className="dash-form-actions"><button className="dash-btn dash-btn--gold" type="submit">{submitLabel}</button></div>
    </form>
  );
}
