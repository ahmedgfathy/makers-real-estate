import type { Lang } from "@/data/content";
import {
  categoryName,
  locationName,
  type Developer,
  type Location,
  type PropertyCategory,
} from "@/lib/catalog";
import { localeCopy, type ProjectQuery, type UnitQuery } from "@/lib/catalog-params";
import { SelectField, TextField } from "./CatalogPieces";

type Option = { value: string; label: string };

function withAll(options: Option[], all: string): Option[] {
  return [{ value: "", label: all }, ...options];
}

export default function CatalogFilterForm({
  lang,
  action,
  mode,
  locations,
  developers,
  categories,
  projectQuery,
  unitQuery,
  showLocationProject = false,
  projects = [],
}: {
  lang: Lang;
  action: string;
  mode: "projects" | "units";
  locations: Location[];
  developers: Developer[];
  categories: PropertyCategory[];
  projectQuery?: ProjectQuery;
  unitQuery?: UnitQuery;
  showLocationProject?: boolean;
  projects?: { id: string; slug: string; nameEn: string; nameAr: string }[];
}) {
  const t = localeCopy(lang);
  const byType = (type: Location["type"]) => locations.filter((item) => item.type === type);
  const options = (items: Location[]) =>
    items.map((item) => ({ value: item.id, label: locationName(item, lang) }));
  const categoryOptions = [
    { value: "residential", label: lang === "ar" ? "عقارات سكنية" : "Residential" },
    ...categories.map((item) => ({
      value: item.slug,
      label: categoryName(item, lang),
    })),
  ];

  return (
    <form className="cat-filters" method="get" action={action}>
      <TextField
        label={t.search}
        name="q"
        value={mode === "projects" ? projectQuery?.q ?? "" : unitQuery?.q ?? ""}
        placeholder={t.searchPlaceholder}
      />

      {mode === "projects" ? (
        <>
          <SelectField
            label={t.governorate}
            name="governorate"
            value={projectQuery?.governorate ?? ""}
            options={withAll(options(byType("governorate")), t.all)}
          />
          <SelectField
            label={t.city}
            name="city"
            value={projectQuery?.city ?? ""}
            options={withAll(options(byType("city")), t.all)}
          />
          <SelectField
            label={t.area}
            name="area"
            value={projectQuery?.area ?? ""}
            options={withAll(
              options(locations.filter((item) => item.type === "area" || item.type === "district")),
              t.all
            )}
          />
          <SelectField
            label={t.developer}
            name="developer"
            value={projectQuery?.developer ?? ""}
            options={withAll(
              developers.map((item) => ({
                value: item.id,
                label: lang === "ar" ? item.nameAr || item.nameEn : item.nameEn,
              })),
              t.all
            )}
          />
          <SelectField
            label={t.category}
            name="category"
            value={projectQuery?.category ?? ""}
            options={withAll(categoryOptions, t.all)}
          />
          <SelectField
            label={t.status}
            name="status"
            value={projectQuery?.status ?? ""}
            options={withAll(
              [
                { value: "ready", label: t.ready },
                { value: "under_construction", label: t.underConstruction },
                { value: "off_plan", label: t.offPlan },
              ],
              t.all
            )}
          />
          <TextField label={t.minPrice} name="minPrice" type="number" value={projectQuery?.minPrice ?? ""} />
          <TextField label={t.maxPrice} name="maxPrice" type="number" value={projectQuery?.maxPrice ?? ""} />
          <TextField
            label={t.minDown}
            name="minDownPayment"
            type="number"
            value={projectQuery?.minDownPayment ?? ""}
          />
          <TextField
            label={t.maxInstallment}
            name="maxInstallment"
            type="number"
            value={projectQuery?.maxInstallment ?? ""}
          />
          <TextField
            label={t.deliveryBefore}
            name="deliveryBefore"
            type="date"
            value={projectQuery?.deliveryBefore ?? ""}
          />
          <SelectField
            label={t.sort}
            name="sort"
            value={projectQuery?.sort ?? "featured"}
            options={[
              { value: "featured", label: t.featured },
              { value: "price_asc", label: t.priceAsc },
              { value: "price_desc", label: t.priceDesc },
              { value: "name", label: t.name },
              { value: "newest", label: t.newest },
            ]}
          />
        </>
      ) : (
        <>
          {showLocationProject ? (
            <>
              <SelectField
                label={t.area}
                name="location"
                value={unitQuery?.location ?? ""}
                options={withAll(options(locations), t.all)}
              />
              <SelectField
                label={t.projects}
                name="project"
                value={unitQuery?.project ?? ""}
                options={withAll(
                  projects.map((item) => ({
                    value: item.slug,
                    label: lang === "ar" ? item.nameAr || item.nameEn : item.nameEn,
                  })),
                  t.all
                )}
              />
            </>
          ) : null}
          <SelectField
            label={t.category}
            name="category"
            value={unitQuery?.category ?? ""}
            options={withAll(categoryOptions, t.all)}
          />
          <SelectField
            label={t.bedrooms}
            name="bedrooms"
            value={unitQuery?.bedrooms ?? ""}
            options={withAll(
              [1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: String(value) })),
              t.all
            )}
          />
          <TextField label={t.minPrice} name="minPrice" type="number" value={unitQuery?.minPrice ?? ""} />
          <TextField label={t.maxPrice} name="maxPrice" type="number" value={unitQuery?.maxPrice ?? ""} />
          <TextField label={t.minArea} name="minArea" type="number" value={unitQuery?.minArea ?? ""} />
          <TextField label={t.maxArea} name="maxArea" type="number" value={unitQuery?.maxArea ?? ""} />
          <SelectField
            label={t.status}
            name="status"
            value={unitQuery?.status ?? ""}
            options={withAll(
              [
                { value: "available", label: t.available },
                { value: "reserved", label: t.reserved },
                { value: "sold", label: t.sold },
              ],
              t.all
            )}
          />
          <SelectField
            label={t.sort}
            name="sort"
            value={unitQuery?.sort ?? "newest"}
            options={[
              { value: "newest", label: t.newest },
              { value: "price_asc", label: t.priceAsc },
              { value: "price_desc", label: t.priceDesc },
              { value: "area_desc", label: t.areaDesc },
            ]}
          />
        </>
      )}

      <button className="btn btn--gold cat-filter-submit" type="submit">
        {t.apply}
      </button>
      <a className="cat-filter-clear" href={action}>
        {t.clear}
      </a>
    </form>
  );
}
