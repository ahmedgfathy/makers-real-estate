import type { Lang } from "@/data/content";

export const ui = {
  en: {
    ground: "Ground",
    groundGarden: "Ground + garden",
    perMonth: "/ mo",
    approx: "≈",
    egp: "EGP",
    m2: "m²",
    book: "Book a viewing",
    explore: "Explore",
    units: "units",
    collections: "offerings",
    siteBy: "Makers Real Estate",
    openTile: "Open",
    top: "Back to top",
  },
  ar: {
    ground: "أرضي",
    groundGarden: "أرضي + حديقة",
    perMonth: "/ شهر",
    approx: "≈",
    egp: "جنيه",
    m2: "م²",
    book: "احجز معاينة",
    explore: "استكشف",
    units: "وحدة",
    collections: "مجموعات",
    siteBy: "ميكرز للعقارات",
    openTile: "افتح",
    top: "أعلى الصفحة",
  },
} satisfies Record<Lang, Record<string, string>>;