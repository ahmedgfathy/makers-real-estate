import type { MetadataRoute } from "next";
import { listDirectoryLocations, listProjects, listUnitSitemapEntries } from "@/lib/catalog";
import { absoluteUrl, localizedAlternates } from "@/lib/seo";

function staticPages(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", "/locations", "/search", "/about", "/contact"];
  return paths.flatMap((path) =>
    (["en", "ar"] as const).map((lang) => ({
      url: absoluteUrl(`/${lang}${path}`),
      priority: path === "" ? 1 : path === "/projects" || path === "/locations" ? 0.9 : 0.6,
      alternates: { languages: localizedAlternates(path) },
    }))
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = staticPages();
  try {
    const [locations, projects, units] = await Promise.all([
      listDirectoryLocations(),
      listProjects({ pageSize: 1000, sort: "name" }),
      listUnitSitemapEntries(),
    ]);

    for (const location of locations) {
      const path = `/locations/${location.slug}`;
      for (const lang of ["en", "ar"] as const) {
        entries.push({
          url: absoluteUrl(`/${lang}${path}`),
          priority: 0.8,
          alternates: { languages: localizedAlternates(path) },
        });
      }
    }

    for (const project of projects.items) {
      const projectPath = `/projects/${project.slug}`;
      for (const lang of ["en", "ar"] as const) {
        entries.push({
          url: absoluteUrl(`/${lang}${projectPath}`),
          lastModified: new Date(project.updatedAt || Date.now()),
          priority: 0.8,
          alternates: { languages: localizedAlternates(projectPath) },
        });
      }
      for (const category of project.categories) {
        const categoryPath = `${projectPath}/${category.slug}`;
        for (const lang of ["en", "ar"] as const) {
          entries.push({
            url: absoluteUrl(`/${lang}${categoryPath}`),
            priority: 0.6,
            alternates: { languages: localizedAlternates(categoryPath) },
          });
        }
      }
    }

    for (const unit of units) {
      const unitPath = `/units/${unit.slug}`;
      for (const lang of ["en", "ar"] as const) {
        entries.push({
          url: absoluteUrl(`/${lang}${unitPath}`),
          lastModified: new Date(unit.updatedAt),
          priority: 0.5,
          alternates: { languages: localizedAlternates(unitPath) },
        });
      }
    }
  } catch (error) {
    console.error("[sitemap] catalogue unavailable, using static routes", error);
  }
  return entries;
}
