import type { Lang, Project } from "@/data/content";

/** Projects with their own detail page (a page per slug under app/[locale]/projects). */
const DETAIL_PAGES = new Set(["sleek", "sarai", "the-lakes", "eastvale"]);

export function projectPath(project: Project, lang: Lang): string {
  const slug = projectSlug(project);
  if (DETAIL_PAGES.has(slug)) return `/${lang}/projects/${slug}`;
  return `/${lang}/projects#${slug}`;
}

export function projectSlug(project: Project): string {
  if (project.slug) return project.slug;
  if (/the lakes|البحيرات/i.test(project.name)) return "the-lakes";
  if (/eastvale|إيست فيل|ايست فيل/i.test(project.name)) return "eastvale";
  if (/sleek/i.test(project.name)) return "sleek";
  if (/sarai|سراي|s-villa/i.test(project.name)) return "sarai";
  return project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
