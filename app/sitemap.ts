import type { MetadataRoute } from "next";
import { absoluteUrl, localizedAlternates } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/en"),
      priority: 1,
      alternates: { languages: localizedAlternates() },
    },
    {
      url: absoluteUrl("/ar"),
      priority: 1,
      alternates: { languages: localizedAlternates() },
    },
    {
      url: absoluteUrl("/en/projects/sleek"),
      priority: 0.8,
      alternates: { languages: localizedAlternates("/projects/sleek") },
    },
    {
      url: absoluteUrl("/ar/projects/sleek"),
      priority: 0.8,
      alternates: { languages: localizedAlternates("/projects/sleek") },
    },
  ];
}
