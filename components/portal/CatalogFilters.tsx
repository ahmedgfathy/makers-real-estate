import type { Lang } from "@/data/content";
import type { Market, PortalCopy } from "@/data/portfolio";

export type CatalogQuery = {
  q: string;
  city: string;
  type: string;
  developer: string;
};

/**
 * Catalogue filter bar. A plain GET form, so results are shareable URLs and the
 * page stays server-rendered.
 */
export default function CatalogFilters({
  lang,
  copy,
  areas,
  developers,
  current,
}: {
  lang: Lang;
  copy: PortalCopy;
  areas: Market[];
  developers: { slug: string; name: string }[];
  current: CatalogQuery;
}) {
  return (
    <form className="pfilters" method="get" action={`/${lang}/projects`}>
      <label className="pfield">
        <span>{copy.filterSearch}</span>
        <input type="search" name="q" defaultValue={current.q} placeholder={copy.searchPlaceholder} />
      </label>

      <label className="pfield">
        <span>{copy.filterCity}</span>
        <select name="city" defaultValue={current.city}>
          <option value="">{copy.filterAll}</option>
          {areas.map((area) => (
            <option key={area.slug} value={area.slug}>
              {area.name[lang]}
            </option>
          ))}
        </select>
      </label>

      <label className="pfield">
        <span>{copy.filterType}</span>
        <select name="type" defaultValue={current.type}>
          <option value="">{copy.filterAll}</option>
          <option value="residential">{copy.residential}</option>
          <option value="commercial">{copy.commercial}</option>
        </select>
      </label>

      <label className="pfield">
        <span>{copy.filterDeveloper}</span>
        <select name="developer" defaultValue={current.developer}>
          <option value="">{copy.filterAll}</option>
          {developers.map((developer) => (
            <option key={developer.slug} value={developer.slug}>
              {developer.name}
            </option>
          ))}
        </select>
      </label>

      <button className="btn btn--gold" type="submit">
        {copy.filterApply}
      </button>
    </form>
  );
}
