import JsonLd from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/seo";

export type BreadcrumbItem = { label: string; href?: string };

/** Schema.org breadcrumb trail matching the visible catalogue breadcrumbs. */
export default function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          ...(item.href ? { item: absoluteUrl(item.href) } : {}),
        })),
      }}
    />
  );
}
