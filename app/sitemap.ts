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
      url: absoluteUrl("/en/projects"),
      priority: 0.9,
      alternates: { languages: localizedAlternates("/projects") },
    },
    {
      url: absoluteUrl("/ar/projects"),
      priority: 0.9,
      alternates: { languages: localizedAlternates("/projects") },
    },
    {
      url: absoluteUrl("/en/about"),
      priority: 0.6,
      alternates: { languages: localizedAlternates("/about") },
    },
    {
      url: absoluteUrl("/ar/about"),
      priority: 0.6,
      alternates: { languages: localizedAlternates("/about") },
    },
    {
      url: absoluteUrl("/en/contact"),
      priority: 0.6,
      alternates: { languages: localizedAlternates("/contact") },
    },
    {
      url: absoluteUrl("/ar/contact"),
      priority: 0.6,
      alternates: { languages: localizedAlternates("/contact") },
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
    {
      url: absoluteUrl("/en/projects/sarai"),
      priority: 0.8,
      alternates: { languages: localizedAlternates("/projects/sarai") },
    },
    {
      url: absoluteUrl("/ar/projects/sarai"),
      priority: 0.8,
      alternates: { languages: localizedAlternates("/projects/sarai") },
    },
  ];
}
