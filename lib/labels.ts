import type { Lang } from "@/data/content";

/** Chrome strings that live outside the database-backed page content. */
export const ui = {
  en: {
    book: "Book a viewing",
    top: "Back to top",
    login: "Login",
    whatsapp: "WhatsApp",
    call: "Call",
    cookies: "Cookie preferences",
    consentText:
      "We use PostHog and Google analytics to improve the site. Analytics are disabled unless you allow them.",
    consentAccept: "Allow",
    consentDecline: "Decline",
  },
  ar: {
    book: "احجز معاينة",
    top: "أعلى الصفحة",
    login: "دخول",
    whatsapp: "واتساب",
    call: "اتصل",
    cookies: "تفضيلات الكوكيز",
    consentText:
      "نستخدم PostHog وأدوات Google للتحليلات وتحسين الموقع. تظل التحليلات متوقفة ما لم توافق.",
    consentAccept: "موافق",
    consentDecline: "رفض",
  },
} satisfies Record<Lang, Record<string, string>>;
