import type { Lang } from "@/data/content";
import type { LocationWithCount } from "@/lib/catalog";
import { LocationCards } from "./CatalogPieces";

export default function HomeLocationSection({
  lang,
  locations,
}: {
  lang: Lang;
  locations: LocationWithCount[];
}) {
  const copy =
    lang === "ar"
      ? {
          kicker: "حسب الموقع",
          title: "استكشف العقارات حسب الموقع",
          lede: "مناطق حقيقية تضم مشروعات معروضة، مع عدد المشروعات وأسعار البداية ووصف مختصر لكل منطقة.",
          all: "كل المواقع",
        }
      : {
          kicker: "By location",
          title: "Explore Properties by Location",
          lede: "Real areas with published projects, showing project counts, starting prices and a short local guide for each one.",
          all: "All locations",
        };

  return (
    <section className="psec psec--off" id="areas" aria-labelledby="areas-title">
      <div className="pwrap">
        <div className="phead">
          <div>
            <p className="pkicker">{copy.kicker}</p>
            <h2 className="ptitle" id="areas-title">{copy.title}</h2>
            <p className="plede">{copy.lede}</p>
          </div>
          <a className="pmore" href={`/${lang}/locations`}>
            {copy.all}
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <LocationCards lang={lang} locations={locations} />
      </div>
    </section>
  );
}
