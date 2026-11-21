import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import {
  getCatalogCounts,
  getCatalogOptions,
  getProjectFacts,
  getProjectFacilities,
  getProjectImages,
  getProjectLandmarks,
  getPaymentPlans,
  getUnitImages,
} from "@/lib/catalog";
import { getCatalogRecord, listCatalogAdmin } from "@/lib/catalog-admin";
import {
  archiveCatalogAction,
  restoreCatalogAction,
  saveCategoryAction,
  saveDeveloperAction,
  saveLocationAction,
  saveProjectAction,
  saveProjectMediaAction,
  saveUnitAction,
} from "./actions";

export const dynamic = "force-dynamic";

type Entity = "locations" | "developers" | "property_categories" | "projects" | "units";
type Row = Record<string, unknown>;

const ENTITIES: { key: Entity; label: string; singular: string }[] = [
  { key: "locations", label: "Locations", singular: "Location" },
  { key: "developers", label: "Developers", singular: "Developer" },
  { key: "property_categories", label: "Categories", singular: "Property category" },
  { key: "projects", label: "Projects", singular: "Project" },
  { key: "units", label: "Units", singular: "Unit" },
];

function text(row: Row | null, key: string): string {
  const value = row?.[key];
  return value === null || value === undefined ? "" : String(value);
}

function checked(row: Row | null, key: string): boolean {
  return row?.[key] === true || row?.[key] === "t";
}

function title(row: Row | null, entity: Entity): string {
  if (!row) return "New";
  if (entity === "units") return text(row, "title_en") || text(row, "reference") || text(row, "id");
  if (entity === "property_categories") return text(row, "name_en");
  return text(row, "name_en") || text(row, "id");
}

function Field({ label, name, value, type = "text", wide = false, required = false }: { label: string; name: string; value?: string; type?: string; wide?: boolean; required?: boolean }) {
  return (
    <label className={`dash-field${wide ? " span-2" : ""}`}>
      <span>{label}</span>
      <input className="dash-input" type={type} name={name} defaultValue={value ?? ""} required={required} />
    </label>
  );
}

function Area({ label, name, value, wide = false }: { label: string; name: string; value?: string | null; wide?: boolean }) {
  return (
    <label className={`dash-field${wide ? " span-3" : ""}`}>
      <span>{label}</span>
      <textarea className="dash-textarea" name={name} defaultValue={value ?? ""} rows={4} />
    </label>
  );
}

function Select({ label, name, value, options, placeholder = "— none —" }: { label: string; name: string; value?: string | null; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <label className="dash-field">
      <span>{label}</span>
      <select className="dash-select" name={name} defaultValue={value ?? ""}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function Check({ label, name, value }: { label: string; name: string; value: boolean }) {
  return (
    <label className="dash-check" style={{ alignSelf: "end", paddingBottom: "0.55rem" }}>
      <input type="checkbox" name={name} defaultChecked={value} />
      <span>{label}</span>
    </label>
  );
}

function StatusControls({ entity, row, canPublish }: { entity: Entity; row: Row; canPublish: boolean }) {
  const archived = Boolean(row.archived_at) || entity === "units" && (row.status === "archived" || row.is_active === false);
  if (!canPublish) return <span className="dash-muted">{archived ? "Archived" : "Active"}</span>;
  return archived ? (
    <form action={restoreCatalogAction}>
      <input type="hidden" name="entity" value={entity} />
      <input type="hidden" name="id" value={text(row, "id")} />
      <button className="dash-linkbtn" type="submit">Restore</button>
    </form>
  ) : (
    <form action={archiveCatalogAction}>
      <input type="hidden" name="entity" value={entity} />
      <input type="hidden" name="id" value={text(row, "id")} />
      <button className="dash-linkbtn dash-linkbtn--danger" type="submit">Archive</button>
    </form>
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; edit?: string; notice?: string; tone?: string; project?: string }>;
}) {
  const session = await requireAdmin("/dashboard/catalog");
  const sp = await searchParams;
  const entity: Entity = ENTITIES.find((item) => item.key === sp.entity)?.key ?? "projects";
  const editId = sp.edit ?? "";
  const [options, counts] = await Promise.all([getCatalogOptions(), getCatalogCounts()]);
  const rows = editId ? [] : await listCatalogAdmin(entity);
  const record = editId ? await getCatalogRecord(entity, editId) : null;
  const unitImages = entity === "units" && editId && editId !== "new" ? await getUnitImages(editId) : [];
  const meta = ENTITIES.find((item) => item.key === entity)!;
  const selectedCategoryIds = entity === "projects" && editId
    ? (await query<{ category_id: string }>(
        "SELECT category_id FROM project_property_categories WHERE project_id = $1 AND is_active",
        [editId]
      )).map((row) => row.category_id)
    : [];

  const mediaProjectId = sp.project || (entity === "projects" ? editId : "");
  const mediaProject = mediaProjectId ? options.projects.find((project) => project.id === mediaProjectId) : null;
  const mediaRows = mediaProjectId
    ? await Promise.all([
        getProjectImages(mediaProjectId),
        getProjectFacilities(mediaProjectId),
        getProjectLandmarks(mediaProjectId),
        getProjectFacts(mediaProjectId),
        getPaymentPlans(mediaProjectId),
      ])
    : null;
  const canPublish = session.role === "admin";

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Catalogue</span>
          <h1>Manage locations, projects & units</h1>
          <p>Every public filter, card and detail page reads from these records. Archive instead of deleting so historical leads keep their context.</p>
        </div>
      </header>

      {sp.notice ? <p className={`dash-alert ${sp.tone === "bad" ? "dash-alert--bad" : ""}`}>{sp.notice}</p> : null}

      <div className="dash-stat-grid">
        <div className="dash-stat"><span>Locations</span><strong>{counts.locations}</strong></div>
        <div className="dash-stat"><span>Projects</span><strong>{counts.projects}</strong></div>
        <div className="dash-stat"><span>Categories</span><strong>{counts.categories}</strong></div>
        <div className="dash-stat"><span>Units</span><strong>{counts.units}</strong></div>
      </div>

      <nav className="dash-tabs" aria-label="Catalogue sections">
        {ENTITIES.map((item) => (
          <a key={item.key} href={`/dashboard/catalog?entity=${item.key}`} data-active={item.key === entity}>
            {item.label}
          </a>
        ))}
      </nav>

      {!editId ? (
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>{meta.label}</h2>
            <a className="btn btn--gold" href={`/dashboard/catalog?entity=${entity}&edit=new`}>Add {meta.singular.toLowerCase()}</a>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Name</th><th>Slug / reference</th><th>Status</th><th /></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={text(row, "id")}>
                    <td><strong>{title(row, entity)}</strong></td>
                    <td dir="ltr">{text(row, "slug") || text(row, "reference") || text(row, "id")}</td>
                    <td><StatusControls entity={entity} row={row} canPublish={canPublish} /></td>
                    <td><a href={`/dashboard/catalog?entity=${entity}&edit=${encodeURIComponent(text(row, "id"))}`}>Edit</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {options.projects.length ? (
            <div style={{ marginTop: "1.5rem" }}>
              <a className="dash-linkbtn" href={`/dashboard/catalog?entity=projects&project=${encodeURIComponent(options.projects[0].id)}`}>
                Manage project media →
              </a>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>{record ? `Edit ${meta.singular.toLowerCase()}` : `New ${meta.singular.toLowerCase()}`}</h2>
            <a className="dash-linkbtn" href={`/dashboard/catalog?entity=${entity}`}>← Back to list</a>
          </div>

          {entity === "locations" ? (
            <form className="dash-form" action={saveLocationAction}>
              <input type="hidden" name="id" value={editId === "new" ? "" : editId} />
              <div className="dash-form-section">
                <h2>Names & hierarchy</h2>
                <div className="dash-form-grid">
                  <Field label="English name *" name="nameEn" value={text(record, "name_en")} required />
                  <Field label="Arabic name *" name="nameAr" value={text(record, "name_ar")} required />
                  <Field label="Slug" name="slug" value={text(record, "slug")} />
                  <Select label="Parent" name="parentId" value={text(record, "parent_id")} options={options.locations.map((item) => ({ value: item.id, label: item.nameEn }))} />
                  <Select label="Type" name="type" value={text(record, "type") || "area"} options={["country", "governorate", "city", "district", "area"].map((value) => ({ value, label: value }))} />
                  <Field label="Sort order" name="sortOrder" type="number" value={text(record, "sort_order")} />
                  <Field label="Image URL" name="imageUrl" value={text(record, "image_url")} />
                  <Check label="Show in location directory" name="isDirectory" value={checked(record, "is_directory")} />
                  <Area label="English description" name="descriptionEn" value={text(record, "description_en")} wide />
                  <Area label="Arabic description" name="descriptionAr" value={text(record, "description_ar")} wide />
                </div>
              </div>
              <div className="dash-form-section">
                <h2>SEO</h2>
                <div className="dash-form-grid">
                  <Field label="SEO title (EN)" name="seoTitleEn" value={text(record, "seo_title_en")} />
                  <Field label="SEO title (AR)" name="seoTitleAr" value={text(record, "seo_title_ar")} />
                  <Area label="SEO description (EN)" name="seoDescriptionEn" value={text(record, "seo_description_en")} wide />
                  <Area label="SEO description (AR)" name="seoDescriptionAr" value={text(record, "seo_description_ar")} wide />
                </div>
              </div>
              <button className="btn btn--gold" type="submit">Save location</button>
            </form>
          ) : null}

          {entity === "developers" ? (
            <form className="dash-form" action={saveDeveloperAction}>
              <input type="hidden" name="id" value={editId === "new" ? "" : editId} />
              <div className="dash-form-grid">
                <Field label="English name *" name="nameEn" value={text(record, "name_en")} required />
                <Field label="Arabic name" name="nameAr" value={text(record, "name_ar")} />
                <Field label="Slug" name="slug" value={text(record, "slug")} />
                <Field label="Website" name="website" value={text(record, "website")} />
                <Field label="Logo URL" name="logoUrl" value={text(record, "logo_url")} />
                <Area label="Description (EN)" name="descriptionEn" value={text(record, "description_en")} wide />
                <Area label="Description (AR)" name="descriptionAr" value={text(record, "description_ar")} wide />
              </div>
              <button className="btn btn--gold" type="submit">Save developer</button>
            </form>
          ) : null}

          {entity === "property_categories" ? (
            <form className="dash-form" action={saveCategoryAction}>
              <input type="hidden" name="id" value={editId === "new" ? "" : editId} />
              <div className="dash-form-grid">
                <Field label="English name *" name="nameEn" value={text(record, "name_en")} required />
                <Field label="Arabic name *" name="nameAr" value={text(record, "name_ar")} required />
                <Field label="Slug" name="slug" value={text(record, "slug")} />
                <Field label="Icon" name="icon" value={text(record, "icon")} />
                <Field label="Sort order" name="sortOrder" type="number" value={text(record, "sort_order")} />
                <Field label="Attributes (JSON)" name="attributes" value={text(record, "attribute_schema") === "{}" ? "" : text(record, "attribute_schema")} wide />
                <Area label="Description (EN)" name="descriptionEn" value={text(record, "description_en")} wide />
                <Area label="Description (AR)" name="descriptionAr" value={text(record, "description_ar")} wide />
              </div>
              <button className="btn btn--gold" type="submit">Save category</button>
            </form>
          ) : null}

          {entity === "projects" ? (
            <form className="dash-form" action={saveProjectAction}>
              <input type="hidden" name="id" value={editId === "new" ? "" : editId} />
              <div className="dash-form-section">
                <h2>Identity</h2>
                <div className="dash-form-grid">
                  <Field label="English name *" name="nameEn" value={text(record, "name_en")} required />
                  <Field label="Arabic name *" name="nameAr" value={text(record, "name_ar")} required />
                  <Field label="Slug" name="slug" value={text(record, "slug")} />
                  <Select label="Developer" name="developerId" value={text(record, "developer_id")} options={options.developers.map((developer) => ({ value: developer.id, label: developer.nameEn }))} />
                  <Select label="Location" name="locationId" value={text(record, "location_id")} options={options.locations.map((item) => ({ value: item.id, label: item.nameEn }))} />
                  <Select label="Status" name="status" value={text(record, "status") || "off_plan"} options={["ready", "under_construction", "off_plan"].map((value) => ({ value, label: value }))} />
                  <Field label="Sort order" name="sortOrder" type="number" value={text(record, "sort_order")} />
                  <Check label="Featured" name="isFeatured" value={checked(record, "is_featured")} />
                  <Area label="Description (EN)" name="descriptionEn" value={text(record, "description_en")} wide />
                  <Area label="Description (AR)" name="descriptionAr" value={text(record, "description_ar")} wide />
                </div>
              </div>
              <div className="dash-form-section">
                <h2>Media & numbers</h2>
                <div className="dash-form-grid">
                  <Field label="Cover image" name="coverImage" value={text(record, "cover_image")} />
                  <Field label="Masterplan image" name="masterplanImage" value={text(record, "masterplan_image")} />
                  <Field label="Video URL" name="videoUrl" value={text(record, "video_url")} />
                  <Field label="Starting price" name="startingPrice" type="number" value={text(record, "starting_price")} />
                  <Field label="Down payment %" name="downPaymentPercent" type="number" value={text(record, "down_payment_percent")} />
                  <Field label="Installment months" name="installmentMonths" type="number" value={text(record, "installment_months")} />
                  <Field label="Delivery date" name="deliveryDate" type="date" value={text(record, "delivery_date").slice(0, 10)} />
                </div>
              </div>
              <div className="dash-form-section">
                <h2>SEO</h2>
                <div className="dash-form-grid">
                  <Field label="SEO title (EN)" name="seoTitleEn" value={text(record, "seo_title_en")} />
                  <Field label="SEO title (AR)" name="seoTitleAr" value={text(record, "seo_title_ar")} />
                  <Area label="SEO description (EN)" name="seoDescriptionEn" value={text(record, "seo_description_en")} wide />
                  <Area label="SEO description (AR)" name="seoDescriptionAr" value={text(record, "seo_description_ar")} wide />
                </div>
              </div>
              <div className="dash-form-section">
                <h2>Property categories</h2>
                <div className="dash-form-grid">
                  {options.categories.map((category) => (
                    <label className="dash-check" key={category.id}>
                      <input type="checkbox" name="categoryIds" value={category.id} defaultChecked={selectedCategoryIds.includes(category.id)} />
                      <span>{category.nameEn}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn--gold" type="submit">Save project</button>
            </form>
          ) : null}

          {entity === "units" ? (
            <form className="dash-form" action={saveUnitAction}>
              <input type="hidden" name="id" value={editId === "new" ? "" : editId} />
              <div className="dash-form-section">
                <h2>Unit identity</h2>
                <div className="dash-form-grid">
                  <Select label="Project" name="projectId" value={text(record, "project_id")} options={options.projects.map((item) => ({ value: item.id, label: item.nameEn }))} />
                  <Select label="Category" name="categoryId" value={text(record, "category_id")} options={options.categories.map((item) => ({ value: item.id, label: item.nameEn }))} />
                  <Field label="Title (EN) *" name="titleEn" value={text(record, "title_en")} required />
                  <Field label="Title (AR) *" name="titleAr" value={text(record, "title_ar")} required />
                  <Field label="Reference" name="reference" value={text(record, "reference")} />
                  <Field label="Slug" name="slug" value={text(record, "slug")} />
                  <Select label="Status" name="status" value={text(record, "status") || "available"} options={["available", "reserved", "sold", "archived"].map((value) => ({ value, label: value }))} />
                  <Area label="Description (EN)" name="descriptionEn" value={text(record, "description_en")} wide />
                  <Area label="Description (AR)" name="descriptionAr" value={text(record, "description_ar")} wide />
                </div>
              </div>
              <div className="dash-form-section">
                <h2>Specifications</h2>
                <div className="dash-form-grid">
                  <Field label="Built-up area" name="builtUpArea" type="number" value={text(record, "built_up_area")} />
                  <Field label="Land area" name="landArea" type="number" value={text(record, "land_area")} />
                  <Field label="Bedrooms" name="bedrooms" type="number" value={text(record, "bedrooms")} />
                  <Field label="Bathrooms" name="bathrooms" type="number" value={text(record, "bathrooms")} />
                  <Field label="Floor" name="floor" value={text(record, "floor")} />
                  <Field label="Garden area" name="gardenArea" type="number" value={text(record, "garden_area")} />
                  <Field label="Terrace area" name="terraceArea" type="number" value={text(record, "terrace_area")} />
                  <Field label="View (EN)" name="viewEn" value={text(record, "view_en")} />
                  <Field label="View (AR)" name="viewAr" value={text(record, "view_ar")} />
                  <Field label="Finishing (EN)" name="finishingEn" value={text(record, "finishing_en")} />
                  <Field label="Finishing (AR)" name="finishingAr" value={text(record, "finishing_ar")} />
                  <Field label="Delivery date" name="deliveryDate" type="date" value={text(record, "delivery_date").slice(0, 10)} />
                </div>
              </div>
              <div className="dash-form-section">
                <h2>Pricing & media</h2>
                <div className="dash-form-grid">
                  <Field label="Total price" name="totalPrice" type="number" value={text(record, "total_price")} />
                  <Field label="Down payment amount" name="downPaymentAmount" type="number" value={text(record, "down_payment_amount")} />
                  <Field label="Down payment %" name="downPaymentPercent" type="number" value={text(record, "down_payment_percent")} />
                  <Field label="Installment months" name="installmentMonths" type="number" value={text(record, "installment_months")} />
                  <Field label="Installment amount" name="installmentAmount" type="number" value={text(record, "installment_amount")} />
                  <Select label="Installment frequency" name="installmentFrequency" value={text(record, "installment_frequency")} options={["monthly", "quarterly", "yearly", "none"].map((value) => ({ value, label: value }))} />
                  <Area label="Image URLs (one per line)" name="images" value={unitImages.map((image) => image.url).join("\n")} wide />
                </div>
              </div>
              <button className="btn btn--gold" type="submit">Save unit</button>
            </form>
          ) : null}
        </section>
      )}

      <section className="dash-panel" style={{ marginTop: "1.5rem" }} id="project-media">
        <div className="dash-panel-head">
          <h2>Project media & details</h2>
          <form method="get" action="/dashboard/catalog" className="dash-inline-form">
            <input type="hidden" name="entity" value="projects" />
            <Select
              label="Project"
              name="project"
              value={mediaProjectId}
              options={options.projects.map((project) => ({ value: project.id, label: project.nameEn }))}
            />
            <button className="dash-linkbtn" type="submit">Load</button>
          </form>
        </div>
        {mediaRows && mediaProject ? (
          <form className="dash-form" action={saveProjectMediaAction}>
            <input type="hidden" name="projectId" value={mediaProject.id} />
            <div className="dash-form-grid">
              <Area label="Gallery image URLs (one per line)" name="images" value={mediaRows[0].map((image) => image.url).join("\n")} wide />
              <Area label="Facilities (Name EN | Name AR per line)" name="facilities" value={mediaRows[1].map((item) => `${item.nameEn} | ${item.nameAr ?? ""}`).join("\n")} wide />
              <Area label="Landmarks (Name EN | Name AR | Distance | Kind per line)" name="landmarks" value={mediaRows[2].map((item) => `${item.nameEn} | ${item.nameAr ?? ""} | ${item.distance ?? ""} | ${item.kind}`).join("\n")} wide />
              <Area label="Facts (Label EN | Label AR | Value EN | Value AR per line)" name="facts" value={mediaRows[3].map((item) => `${item.labelEn} | ${item.labelAr ?? ""} | ${item.valueEn} | ${item.valueAr ?? ""}`).join("\n")} wide />
              <Field label="Plan name (EN)" name="planNameEn" value={mediaRows[4][0]?.nameEn ?? "Developer payment plan"} />
              <Field label="Plan name (AR)" name="planNameAr" value={mediaRows[4][0]?.nameAr ?? "خطة سداد المطور"} />
              <Field label="Plan down payment %" name="planDownPayment" type="number" value={mediaRows[4][0]?.downPaymentPercent == null ? "" : String(mediaRows[4][0].downPaymentPercent)} />
              <Field label="Plan installment months" name="planInstallmentMonths" type="number" value={mediaRows[4][0]?.installmentMonths == null ? "" : String(mediaRows[4][0].installmentMonths)} />
              <Field label="Plan delivery date" name="planDeliveryDate" type="date" value={mediaRows[4][0]?.deliveryDate ?? ""} />
              <Area label="Plan note (EN)" name="planNotesEn" value={mediaRows[4][0]?.notesEn ?? ""} wide />
              <Area label="Plan note (AR)" name="planNotesAr" value={mediaRows[4][0]?.notesAr ?? ""} wide />
            </div>
            <button className="btn btn--gold" type="submit">Save project media</button>
          </form>
        ) : (
          <p className="dash-muted">Choose a project to manage its gallery, facilities, landmarks, facts and payment plan.</p>
        )}
      </section>
    </div>
  );
}
