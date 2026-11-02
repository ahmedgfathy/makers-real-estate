export type Lang = "en" | "ar";

export type Stat = { value: string; label: string };

export type Content = {
  meta: { title: string; description: string };
  brand: { name: string; tagline: string; sub: string };
  nav: { contact: string; call: string };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    place: string;
    lede: string;
    primary: string;
    secondary: string;
    scroll: string;
    stats: Stat[];
  };
  footer: {
    title: string;
    lede: string;
    advisor: string;
    role: string;
    whatsapp: string;
    call: string;
    disclaimer: string;
    rights: string;
    builtWith: string;
    sections: string;
  };
  leadForm: {
    kicker: string;
    title: string;
    lede: string;
    name: string;
    nameHint: string;
    phone: string;
    phoneHint: string;
    email: string;
    emailHint: string;
    project: string;
    bedrooms: string;
    message: string;
    messageHint: string;
    consent: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successLede: string;
    error: string;
    required: string;
    projectOptions: string[];
    bedroomOptions: string[];
  };
};


const en: Content = {
  meta: {
    title: "Makers Real Estate — The Lakes at SODIC East",
    description:
      "Makers Real Estate presents The Lakes at SODIC East, New Heliopolis. Apartments and duplexes from EGP 6.7M, 0% down payment, ten-year installments, delivery December 2026.",
  },
  brand: { name: "Makers", tagline: "Real Estate", sub: "SODIC East · New Heliopolis" },
  nav: { contact: "Contact", call: "Call" },
  hero: {
    eyebrow: "Makers Real Estate · SODIC East",
    titleLine1: "The",
    titleLine2: "Lakes",
    place: "New Heliopolis · East Cairo",
    lede:
      "Water, landscape and everyday life wrapped around a swimmable central lagoon. Homes from EGP 6.7M with 0% down and ten years to pay.",
    primary: "Explore the collection",
    secondary: "Speak to an advisor",
    scroll: "Scroll to explore",
    stats: [
      { value: "655", label: "Acres master plan" },
      { value: "55%", label: "Open space" },
      { value: "0%", label: "Down payment" },
      { value: "10 yrs", label: "Installments" },
    ],
  },
  footer: {
    title: "Let’s find your address.",
    lede:
      "Seif El Din Tarek walks you through layouts, availability and payment schedules — usually within the hour.",
    advisor: "Seif El Din Tarek",
    role: "Senior Property Consultant · SODIC",
    whatsapp: "WhatsApp",
    call: "0100 950 0083",
    disclaimer:
      "Prices, areas and availability are indicative and subject to change without notice. Images are artist impressions of The Lakes at SODIC East. Delivery dates are per phase.",
    rights: "Makers Real Estate. All rights reserved.",
    builtWith: "SODIC East · The Lakes · Phase 08M",
    sections: "Sections",
  },
  leadForm: {
    kicker: "Request a call back",
    title: "Tell us what you’re looking for",
    lede:
      "Leave your number and an advisor calls you back — usually within the hour, seven days a week.",
    name: "Full name",
    nameHint: "",
    phone: "Phone",
    phoneHint: "0100 000 0000",
    email: "Email (optional)",
    emailHint: "",
    project: "Project of interest",
    bedrooms: "Bedrooms",
    message: "Message (optional)",
    messageHint: "Budget, preferred floor, view…",
    consent: "I agree to be contacted about this enquiry.",
    submit: "Request a call",
    submitting: "Sending…",
    successTitle: "Thank you — we have your enquiry.",
    successLede:
      "An advisor will call you back shortly. Prefer WhatsApp? Message us any time.",
    error: "Could not send — please try again or call us directly.",
    required: "Name and phone required.",
    projectOptions: ["The Lakes", "EastVale"],
    bedroomOptions: ["Any", "1", "2", "3", "4+"],
  },
};

const ar: Content = {
  meta: {
    title: "ميكرز للعقارات — البحيرات في سوديك إيست",
    description:
      "ميكرز للعقارات تقدم البحيرات داخل سوديك إيست، هليوبوليس الجديدة. شقق ودوبلكس تبدأ من 6.7 مليون جنيه، بدون مقدم، وتقسيط على 10 سنوات، والتسليم ديسمبر 2026.",
  },
  brand: { name: "ميكرز", tagline: "للعقارات", sub: "سوديك إيست · هليوبوليس الجديدة" },
  nav: { contact: "تواصل", call: "اتصل" },
  hero: {
    eyebrow: "ميكرز للعقارات · سوديك إيست",
    titleLine1: "البحيرات",
    titleLine2: "",
    place: "هليوبوليس الجديدة · شرق القاهرة",
    lede:
      "مياه ومساحات خضراء وحياة يومية حول بحيرة مركزية صالحة للسباحة. وحدات تبدأ من 6.7 مليون جنيه، بدون مقدم وتقسيط على 10 سنوات.",
    primary: "استكشف المجموعة",
    secondary: "تحدث مع مستشار",
    scroll: "انزل للاستكشاف",
    stats: [
      { value: "655", label: "فدان" },
      { value: "55%", label: "مساحات مفتوحة" },
      { value: "0%", label: "مقدم الحجز" },
      { value: "10 سنوات", label: "مدة التقسيط" },
    ],
  },
  footer: {
    title: "لنحدد عنوانك.",
    lede:
      "سيف الدين طارق يشرح لك المخططات والمتاح والأسعار وخطط السداد — عادة خلال ساعة من تواصلك.",
    advisor: "سيف الدين طارق",
    role: "مستشار عقاري أول · سوديك",
    whatsapp: "واتساب",
    call: "0100 950 0083",
    disclaimer:
      "الأسعار والمساحات والمتاح إرشادية وقابلة للتغيير دون إشعار. الصور تخييلية لمشروع البحيرات داخل سوديك إيست. مواعيد التسليم حسب المرحلة.",
    rights: "ميكرز للعقارات. جميع الحقوق محفوظة.",
    builtWith: "سوديك إيست · البحيرات · مرحلة 08M",
    sections: "الأقسام",
  },
  leadForm: {
    kicker: "اطلب مكالمة",
    title: "أخبرنا بما تبحث عنه",
    lede:
      "اترك رقمك وسيقوم المستشار بالاتصال بك — عادة خلال ساعة، طوال أيام الأسبوع.",
    name: "الاسم بالكامل",
    nameHint: "",
    phone: "رقم الهاتف",
    phoneHint: "0100 000 0000",
    email: "البريد الإلكتروني (اختياري)",
    emailHint: "",
    project: "المشروع المهتم به",
    bedrooms: "عدد غرف النوم",
    message: "رسالة (اختياري)",
    messageHint: "الميزانية، الدور المفضل، الإطلالة…",
    consent: "أوافق على التواصل معي بخصوص هذا الطلب.",
    submit: "اطلب مكالمة",
    submitting: "جارٍ الإرسال…",
    successTitle: "شكرًا لك — استلمنا طلبك.",
    successLede: "سيقوم المستشار بالتواصل معك قريبًا. تفضل واتساب؟ راسلنا في أي وقت.",
    error: "تعذر الإرسال — حاول مرة أخرى أو اتصل بنا مباشرة.",
    required: "الاسم والهاتف مطلوبان.",
    projectOptions: ["ذا ليكس", "إيست ڤيل"],
    bedroomOptions: ["الكل", "1", "2", "3", "4+"],
  },
};

const LRI = "\u2066";
const PDI = "\u2069";
const NUM_CHUNK = /[A-Za-z0-9][A-Za-z0-9,.\/\u2013\-+%]*(?:\s*[\u2013\-]\s*[A-Za-z0-9][A-Za-z0-9,.\/\u2013\-+%]*)*/g;
const SKIP_KEYS = new Set(["id", "src", "image", "kind"]);

const isolateText = (s: string) =>
  /^\//.test(s) || /^(https?:|tel:|mailto:)/.test(s) ? s : s.replace(NUM_CHUNK, (m) => LRI + m + PDI);

function isolateDeep<T>(value: T, key?: string): T {
  if (typeof value === "string") {
    return (SKIP_KEYS.has(key ?? "") ? value : isolateText(value)) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => isolateDeep(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = isolateDeep(v, k);
    }
    return out as T;
  }
  return value;
}

export const content: Record<Lang, Content> = { en, ar: isolateDeep(ar) };

export type Contact = {
  name: Record<Lang, string>;
  phoneLabel: string;
  phoneHref: string;
  whatsapp: string;
  whatsappMessage: Record<Lang, string>;
};

export const contact: Contact = {
  name: { en: "Seif El Din Tarek", ar: "سيف الدين طارق" },
  phoneLabel: "0100 950 0083",
  phoneHref: "tel:+201009500083",
  whatsapp: "https://wa.me/201009500083",
  whatsappMessage: {
    en: "Hello Seif, I am interested in SODIC East — please send me the layouts and payment plan.",
    ar: "أهلاً سيف، مهتم بمشروع سوديك إيست — من فضلك ابعتلي المخططات وخطة السداد.",
  },
};

export const whatsappLink = (c: Contact, lang: Lang) =>
  c.whatsapp + "?text=" + encodeURIComponent(c.whatsappMessage[lang]);
