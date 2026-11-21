import type { Lang } from "@/data/content";
import {
  descendantIds,
  type Location,
  type ProjectFilters,
  type UnitFilters,
} from "./catalog";

export type RawQuery = Record<string, string | string[] | undefined>;

export function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function numberValue(value: string | string[] | undefined): number | undefined {
  const text = one(value).trim();
  if (!text) return undefined;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function dateValue(value: string | string[] | undefined): string | undefined {
  const text = one(value).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : undefined;
}

export type ProjectQuery = {
  q: string;
  governorate: string;
  city: string;
  area: string;
  location: string;
  developer: string;
  category: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  minDownPayment: string;
  maxInstallment: string;
  deliveryBefore: string;
  sort: string;
  page: string;
};

export function readProjectQuery(sp: RawQuery): ProjectQuery {
  return {
    q: one(sp.q),
    governorate: one(sp.governorate),
    city: one(sp.city),
    area: one(sp.area),
    location: one(sp.location),
    developer: one(sp.developer),
    category: one(sp.category),
    status: one(sp.status),
    minPrice: one(sp.minPrice),
    maxPrice: one(sp.maxPrice),
    minDownPayment: one(sp.minDownPayment),
    maxInstallment: one(sp.maxInstallment),
    deliveryBefore: one(sp.deliveryBefore),
    sort: one(sp.sort),
    page: one(sp.page),
  };
}

/** The deepest selected hierarchy level wins; all selections stay in the URL. */
export function queryLocationIds(query: ProjectQuery, locations: Location[]): string[] {
  const selected = query.area || query.city || query.governorate || query.location;
  if (!selected) return [];
  const location = locations.find((item) => item.id === selected);
  return location ? descendantIds(locations, location.id) : [selected];
}

export function projectFilters(query: ProjectQuery, locations: Location[]): ProjectFilters {
  const sort = (["featured", "price_asc", "price_desc", "name", "newest"] as const).find(
    (value) => value === query.sort
  );
  return {
    q: query.q.trim() || undefined,
    locationIds: queryLocationIds(query, locations),
    developer: query.developer || undefined,
    category: query.category || undefined,
    status: query.status || undefined,
    minPrice: numberValue(query.minPrice),
    maxPrice: numberValue(query.maxPrice),
    minDownPayment: numberValue(query.minDownPayment),
    maxInstallment: numberValue(query.maxInstallment),
    deliveryBefore: dateValue(query.deliveryBefore),
    sort: sort ?? "featured",
    page: numberValue(query.page) ?? 1,
    pageSize: 9,
  };
}

export type UnitQuery = {
  q: string;
  location: string;
  project: string;
  category: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  status: string;
  sort: string;
  page: string;
};

export function readUnitQuery(sp: RawQuery): UnitQuery {
  return {
    q: one(sp.q),
    location: one(sp.location),
    project: one(sp.project),
    category: one(sp.category),
    bedrooms: one(sp.bedrooms),
    minPrice: one(sp.minPrice),
    maxPrice: one(sp.maxPrice),
    minArea: one(sp.minArea),
    maxArea: one(sp.maxArea),
    status: one(sp.status),
    sort: one(sp.sort),
    page: one(sp.page),
  };
}

export function unitFilters(query: UnitQuery, projectSlug?: string, locationIds?: string[]): UnitFilters {
  const sort = (["price_asc", "price_desc", "area_desc", "newest"] as const).find(
    (value) => value === query.sort
  );
  return {
    q: query.q.trim() || undefined,
    locationIds,
    project: projectSlug || query.project || undefined,
    category: query.category || undefined,
    bedrooms: numberValue(query.bedrooms),
    minPrice: numberValue(query.minPrice),
    maxPrice: numberValue(query.maxPrice),
    minArea: numberValue(query.minArea),
    maxArea: numberValue(query.maxArea),
    status: query.status || undefined,
    sort: sort ?? "newest",
    page: numberValue(query.page) ?? 1,
    pageSize: 9,
  };
}

/** Keeps every filter in query strings so no selection is lost between pages. */
export function queryRecord(query: Record<string, string>): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value));
}

export function localeCopy(lang: Lang) {
  return lang === "ar"
    ? {
        search: "بحث",
        searchPlaceholder: "ابحث بالاسم أو المطور",
        all: "الكل",
        governorate: "المحافظة",
        city: "المدينة",
        area: "المنطقة",
        developer: "المطور",
        category: "نوع العقار",
        status: "الحالة",
        minPrice: "أقل سعر",
        maxPrice: "أعلى سعر",
        minDown: "أقل مقدم %",
        maxInstallment: "أقصى تقسيط (شهر)",
        deliveryBefore: "التسليم قبل",
        bedrooms: "غرف النوم",
        minArea: "أقل مساحة",
        maxArea: "أعلى مساحة",
        sort: "الترتيب",
        apply: "تطبيق",
        results: "نتيجة",
        projects: "المشروع",
        clear: "مسح الفلاتر",
        featured: "المميزة",
        priceAsc: "السعر: الأقل أولاً",
        priceDesc: "السعر: الأعلى أولاً",
        areaDesc: "المساحة: الأكبر أولاً",
        name: "الاسم",
        newest: "الأحدث",
        ready: "جاهز",
        underConstruction: "تحت الإنشاء",
        offPlan: "طرح أولي",
        available: "متاحة",
        reserved: "محجوزة",
        sold: "مباعة",
      }
    : {
        search: "Search",
        searchPlaceholder: "Name, developer or location",
        all: "All",
        governorate: "Governorate",
        city: "City",
        area: "Area / district",
        developer: "Developer",
        category: "Property category",
        status: "Status",
        minPrice: "Min price",
        maxPrice: "Max price",
        minDown: "Min down payment %",
        maxInstallment: "Max instalments (months)",
        deliveryBefore: "Delivery before",
        bedrooms: "Bedrooms",
        minArea: "Min area",
        maxArea: "Max area",
        sort: "Sort",
        apply: "Apply filters",
        results: "results",
        projects: "Project",
        clear: "Clear filters",
        featured: "Featured",
        priceAsc: "Price: low to high",
        priceDesc: "Price: high to low",
        areaDesc: "Area: largest first",
        name: "Name",
        newest: "Newest",
        ready: "Ready to move",
        underConstruction: "Under construction",
        offPlan: "Off-plan",
        available: "Available",
        reserved: "Reserved",
        sold: "Sold",
      };
}
