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
      "We measure how this site is used (PostHog) to improve the listings. Nothing is tracked unless you allow it.",
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
      "نقيس كيفية استخدام الموقع (PostHog) لتحسين المعروض. لا يتم تتبع أي شيء بدون موافقتك.",
    consentAccept: "موافق",
    consentDecline: "رفض",
  },
} satisfies Record<Lang, Record<string, string>>;
