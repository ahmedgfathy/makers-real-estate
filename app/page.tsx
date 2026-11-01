import Landing from "@/components/Landing";
import { getSite } from "@/lib/content-db";
import { listProperties } from "@/lib/admin";
import { listProjects, REGIONS } from "@/lib/projects";

// Content lives in PostgreSQL and must be read at request time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ content, contact }, projects, publishedUnits] = await Promise.all([
    getSite(),
    listProjects({ publishedOnly: true }),
    listProperties({ publishedOnly: true, limit: 500 }),
  ]);
  const homeProjects = projects.map((project) => {
    const units = publishedUnits.filter((unit) => unit.project_slug === project.slug);
    const unitPrice = units.length ? Math.min(...units.map((unit) => unit.price)) : null;
    return {
      slug: project.slug,
      name: project.name,
      nameAr: project.nameAr,
      developerName: project.developerName,
      regionName: REGIONS[project.region],
      heroImage: project.heroImage,
      priceFrom: unitPrice ?? project.priceFrom,
      unitCount: units.length,
    };
  });
  return <Landing content={content} contact={contact} projects={homeProjects} />;
}
