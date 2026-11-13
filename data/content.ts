export type Lang = "en" | "ar";

export type Stat = { value: string; label: string };

export type Project = {
  name: string;
  location: string;
  type: string;
  priceFrom: string;
  status: string;
  image: string;
  note: string;
  href?: string;
};

export type Content = {
  meta: { title: string; description: string };
  brand: { name: string; tagline: string; sub: string };
  nav: { projects: string; why: string; payment: string; contact: string; call: string };
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
  sections: {
    intro: {
      kicker: string;
      title: string;
      lede: string;
      body: string;
      facts: Stat[];
    };
    projects: {
      kicker: string;
      title: string;
      lede: string;
      items: Project[];
    };
    advantages: {
      kicker: string;
      title: string;
      lede: string;
      items: { title: string; text: string }[];
    };
    amenities: {
      kicker: string;
      title: string;
      lede: string;
      image: string;
      items: string[];
    };
    payment: {
      kicker: string;
      title: string;
      lede: string;
      stats: Stat[];
      note: string;
    };
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
    title: "Makers Real Estate — SODIC East & Sleek South 90th",
    description:
      "Primary residences at The Lakes and EastVale, plus Sleek retail, offices and clinics on South 90th Street. Developer pricing and payment plans.",
  },
  brand: { name: "Makers", tagline: "Real Estate", sub: "SODIC East · South 90th" },
  nav: {
    projects: "Projects",
    why: "Why primary",
    payment: "Payment",
    contact: "Contact",
    call: "Call",
  },
  hero: {
    eyebrow: "Primary sales · Direct from the developer",
    titleLine1: "The Lakes",
    titleLine2: "SODIC East",
    place: "New Heliopolis · East Cairo",
    lede:
      "First-release apartments and duplexes, sold directly by the developer. Official pricing, 0% down and ten years to pay — with no resale premium.",
    primary: "Explore the residences",
    secondary: "WhatsApp our team",
    scroll: "Discover SODIC East",
    stats: [
      { value: "655", label: "Acres master plan" },
      { value: "55%", label: "Open landscape" },
      { value: "0%", label: "Down payment" },
      { value: "10 yrs", label: "Instalments" },
    ],
  },
  sections: {
    intro: {
      kicker: "Primary only",
      title: "A first-release address, handled properly.",
      lede:
        "Makers Real Estate sells primary units at SODIC East — homes released by the developer, not resold by an owner.",
      body:
        "That changes what you see: the official price list, live availability, the developer's own payment schedule and the real handover dates. No inflated resale ticket, no inherited problems, no guessing what the unit is worth.",
      facts: [
        { value: "2", label: "SODIC East addresses" },
        { value: "100%", label: "Primary releases" },
        { value: "7 days", label: "Sales support" },
      ],
    },
    projects: {
      kicker: "The portfolio",
      title: "Three destinations. One standard.",
      lede:
        "Two SODIC East residential addresses and Sleek on South 90th — primary opportunities across homes, retail, offices and clinics.",
      items: [
        {
          name: "The Lakes",
          location: "SODIC East · New Heliopolis",
          type: "Apartments & duplexes",
          priceFrom: "From EGP 6.7M",
          status: "Now releasing",
          image: "/img/lakes-pool.jpg",
          note: "0% down · 10-year plan · Delivery December 2026",
        },
        {
          name: "EastVale",
          location: "SODIC East · New Heliopolis",
          type: "Apartments & townhouses",
          priceFrom: "Price list on request",
          status: "Primary allocation",
          image: "/img/lakes-sunset.jpg",
          note: "Official launch pricing · Developer payment plans",
        },
        {
          name: "Sleek",
          location: "South 90th St · Mohamed Naguib Axis",
          type: "Retail, F&B, offices & clinics",
          priceFrom: "From EGP 194k / m²",
          status: "New project",
          image: "/sleek/exterior.jpg",
          note: "5% down · 6-year plan · Delivery Q1 2029",
          href: "#sleek",
        },
      ],
    },
    advantages: {
      kicker: "Why primary",
      title: "Buy first. Not second.",
      lede:
        "A primary purchase is the cleanest route into a developer's project — and the only one that starts at the official price.",
      items: [
        {
          title: "Developer price",
          text: "The launch price from the source, with no resale premium layered on top.",
        },
        {
          title: "Official payment plan",
          text: "The developer's down payment and instalment schedule, confirmed in writing.",
        },
        {
          title: "Clean allocation",
          text: "First-release units with clear title and the developer as the seller.",
        },
        {
          title: "Delivery certainty",
          text: "Phased handover dates and construction updates, straight from the project.",
        },
      ],
    },
    amenities: {
      kicker: "The master plan",
      title: "655 acres, built around water.",
      lede:
        "A swimmable central lagoon, a green spine and everyday amenities inside SODIC East — planned as one complete neighbourhood.",
      image: "/img/lakes-sunset.jpg",
      items: [
        "Swimmable central lagoon",
        "55% open landscape",
        "SODIC Sports Club",
        "International school",
        "Cycling and running spine",
        "Retail and dining promenade",
      ],
    },
    payment: {
      kicker: "Payment",
      title: "A plan that starts at zero.",
      lede:
        "Selected first-release residences are available with 0% down and ten years to pay — the developer's schedule, confirmed in the reservation contract.",
      stats: [
        { value: "0%", label: "Down payment" },
        { value: "10 yrs", label: "Instalments" },
        { value: "120", label: "Monthly payments" },
        { value: "Dec 2026", label: "First delivery" },
      ],
      note:
        "Monthly figures are indicative and calculated at 0% interest. The final schedule, delivery date and unit price are set by the developer in the reservation contract.",
    },
  },
  footer: {
    title: "Request the primary price list.",
    lede:
      "Speak to Ahmed Hassan for live availability, floor plans and the developer's payment schedule — usually within the hour.",
    advisor: "Ahmed Hassan",
    role: "Primary Sales Consultant · Makers Real Estate",
    whatsapp: "WhatsApp",
    call: "0111 620 4890",
    disclaimer:
      "Primary sales only. Makers Real Estate is an authorised sales partner for the developments shown. Prices, areas, availability and payment plans are indicative, subject to developer confirmation and change without notice. Images are artist impressions.",
    rights: "Makers Real Estate. All rights reserved.",
    builtWith: "SODIC East · The Lakes · EastVale · Sleek",
    sections: "Sections",
  },
  leadForm: {
    kicker: "Request a call back",
    title: "Tell us what you are looking for.",
    lede:
      "Leave your number and a primary-sales advisor calls you back with live availability, floor plans and the developer's payment schedule.",
    name: "Full name",
    nameHint: "",
    phone: "Phone",
    phoneHint: "0100 000 0000",
    email: "Email (optional)",
    emailHint: "",
    project: "Project of interest",
    bedrooms: "Bedrooms",
    message: "Message (optional)",
    messageHint: "Preferred floor, view, budget…",
    consent: "I agree to be contacted about this enquiry.",
    submit: "Request a call",
    submitting: "Sending…",
    successTitle: "Thank you — we have your enquiry.",
    successLede:
      "A primary-sales advisor will call you back shortly. Prefer WhatsApp? Message us any time.",
    error: "Could not send — please try again or call us directly.",
    required: "Name and phone required.",
    projectOptions: ["The Lakes", "EastVale", "Sleek"],
    bedroomOptions: ["Any", "1", "2", "3", "4+"],
  },
};

const ar: Content = {
  meta: {
    title: "ميكرز للعقارات — سوديك إيست وسليك التسعين الجنوبي",
    description:
      "وحدات أولية في البحيرات وإيست فيل، ومشروع سليك التجاري والإداري والطبي في شارع التسعين الجنوبي. أسعار وخطط سداد من المطور.",
  },
  brand: { name: "ميكرز", tagline: "للعقارات", sub: "سوديك إيست · التسعين الجنوبي" },
  nav: {
    projects: "المشروعات",
    why: "لماذا أولي",
    payment: "السداد",
    contact: "تواصل",
    call: "اتصل",
  },
  hero: {
    eyebrow: "بيع أولي · مباشرة من المطور",
    titleLine1: "البحيرات",
    titleLine2: "سوديك إيست",
    place: "هليوبوليس الجديدة · شرق القاهرة",
    lede:
      "شقق ودوبلكس من الإطلاق الأول، بيع مباشر من المطور. أسعار رسمية، بدون مقدم وتقسيط على 10 سنوات — بدون علاوة إعادة بيع.",
    primary: "استكشف الوحدات",
    secondary: "تواصل واتساب",
    scroll: "اكتشف سوديك إيست",
    stats: [
      { value: "655", label: "فدان ماستر بلان" },
      { value: "55%", label: "مساحات مفتوحة" },
      { value: "0%", label: "مقدم الحجز" },
      { value: "10 سنوات", label: "مدة التقسيط" },
    ],
  },
  sections: {
    intro: {
      kicker: "بيع أولي فقط",
      title: "عنوان من الإطلاق الأول، بتعامل احترافي.",
      lede:
        "ميكرز للعقارات تبيع وحدات أولية في سوديك إيست — وحدات يطرحها المطور، وليست إعادة بيع من مالك.",
      body:
        "هذا يغيّر ما تراه: قائمة الأسعار الرسمية، المتاح الفعلي، جدول سداد المطور ومواعيد التسليم الحقيقية. بدون سعر إعادة بيع مرتفع، وبدون مشاكل موروثة، وبدون تخمين لقيمة الوحدة.",
      facts: [
        { value: "2", label: "عنوان في سوديك إيست" },
        { value: "100%", label: "وحدات أولية" },
        { value: "7 أيام", label: "دعم المبيعات" },
      ],
    },
    projects: {
      kicker: "المعروض",
      title: "ثلاث وجهات. معيار واحد.",
      lede:
        "عنوانان سكنيان في سوديك إيست ومشروع سليك في شارع التسعين الجنوبي — فرص أولية للسكن والتجزئة والمكاتب والعيادات.",
      items: [
        {
          name: "البحيرات",
          location: "سوديك إيست · هليوبوليس الجديدة",
          type: "شقق ودوبلكس",
          priceFrom: "تبدأ من 6.7 مليون جنيه",
          status: "متاح الآن",
          image: "/img/lakes-pool.jpg",
          note: "بدون مقدم · تقسيط 10 سنوات · تسليم ديسمبر 2026",
        },
        {
          name: "إيست فيل",
          location: "سوديك إيست · هليوبوليس الجديدة",
          type: "شقق وتاون هاوس",
          priceFrom: "قائمة الأسعار عند الطلب",
          status: "طرح أولي",
          image: "/img/lakes-sunset.jpg",
          note: "أسعار الإطلاق الرسمية · خطط سداد من المطور",
        },
        {
          name: "Sleek",
          location: "شارع التسعين الجنوبي · محور محمد نجيب",
          type: "تجزئة ومطاعم ومكاتب وعيادات",
          priceFrom: "من 194 ألف جنيه/م²",
          status: "مشروع جديد",
          image: "/sleek/exterior.jpg",
          note: "5% مقدم · تقسيط 6 سنوات · التسليم الربع الأول 2029",
          href: "#sleek",
        },
      ],
    },
    advantages: {
      kicker: "لماذا أولي",
      title: "اشترِ أولاً. لا تُعِد البيع.",
      lede:
        "الشراء الأولي هو الطريق الأنظف إلى مشروع المطور — والوحيد الذي يبدأ بالسعر الرسمي.",
      items: [
        {
          title: "سعر المطور",
          text: "سعر الإطلاق من المصدر، بدون علاوة إعادة بيع مضافة.",
        },
        {
          title: "خطة سداد رسمية",
          text: "مقدم وأقساط المطور، موثقة كتابةً في العقد.",
        },
        {
          title: "تخصيص نظيف",
          text: "وحدات من الطرح الأول بملكية واضحة والمطور هو البائع.",
        },
        {
          title: "تسليم مضمون",
          text: "مواعيد تسليم مرحلية وتحديثات إنشاء من المشروع مباشرة.",
        },
      ],
    },
    amenities: {
      kicker: "الماستر بلان",
      title: "655 فدانًا حول الماء.",
      lede:
        "بحيرة مركزية صالحة للسباحة، محور أخضر وخدمات يومية داخل سوديك إيست — كحي متكامل واحد.",
      image: "/img/lakes-sunset.jpg",
      items: [
        "بحيرة مركزية صالحة للسباحة",
        "55% مساحات مفتوحة",
        "نادي سوديك الرياضي",
        "مدرسة دولية",
        "مسار للدراجات والجري",
        "ممشى تجاري ومطاعم",
      ],
    },
    payment: {
      kicker: "السداد",
      title: "خطة تبدأ من صفر.",
      lede:
        "وحدات مختارة من الطرح الأول متاحة بدون مقدم وتقسيط على 10 سنوات — جدول المطور، مؤكد في عقد الحجز.",
      stats: [
        { value: "0%", label: "مقدم الحجز" },
        { value: "10 سنوات", label: "مدة التقسيط" },
        { value: "120", label: "قسط شهري" },
        { value: "ديسمبر 2026", label: "أول تسليم" },
      ],
      note:
        "الأرقام الشهرية إرشادية وتحسب بدون فوائد. الجدول النهائي وموعد التسليم وسعر الوحدة يحددها المطور في عقد الحجز.",
    },
  },
  footer: {
    title: "اطلب قائمة الأسعار الأولية.",
    lede:
      "تحدث مع أحمد حسن لمعرفة المتاح الفعلي والمخططات وجدول سداد المطور — عادة خلال ساعة.",
    advisor: "أحمد حسن",
    role: "مستشار مبيعات أولية · ميكرز للعقارات",
    whatsapp: "واتساب",
    call: "0111 620 4890",
    disclaimer:
      "بيع أولي فقط. ميكرز للعقارات شريك بيع معتمد للمشروعات المعروضة. الأسعار والمساحات والمتاح وخطط السداد إرشادية وتخضع لتأكيد المطور والتغيير دون إشعار. الصور تخييلية.",
    rights: "ميكرز للعقارات. جميع الحقوق محفوظة.",
    builtWith: "سوديك إيست · البحيرات · إيست فيل · Sleek",
    sections: "الأقسام",
  },
  leadForm: {
    kicker: "اطلب مكالمة",
    title: "أخبرنا بما تبحث عنه.",
    lede:
      "اترك رقمك وسيتصل بك مستشار المبيعات الأولية بالمتاح الفعلي والمخططات وجدول سداد المطور.",
    name: "الاسم بالكامل",
    nameHint: "",
    phone: "رقم الهاتف",
    phoneHint: "0100 000 0000",
    email: "البريد الإلكتروني (اختياري)",
    emailHint: "",
    project: "المشروع المهتم به",
    bedrooms: "عدد غرف النوم",
    message: "رسالة (اختياري)",
    messageHint: "الدور المفضل، الإطلالة، الميزانية…",
    consent: "أوافق على التواصل معي بخصوص هذا الطلب.",
    submit: "اطلب مكالمة",
    submitting: "جارٍ الإرسال…",
    successTitle: "شكرًا لك — استلمنا طلبك.",
    successLede: "سيتواصل معك مستشار المبيعات الأولية قريبًا. تفضل واتساب؟ راسلنا في أي وقت.",
    error: "تعذر الإرسال — حاول مرة أخرى أو اتصل بنا مباشرة.",
    required: "الاسم والهاتف مطلوبان.",
    projectOptions: ["البحيرات", "إيست فيل", "Sleek"],
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
  whatsappLabel: string;
  whatsapp: string;
  whatsappMessage: Record<Lang, string>;
};

/**
 * Two numbers, deliberately separate:
 * - WhatsApp is the first number and must never be dialled.
 * - Calls are received on the second number.
 */
export const contact: Contact = {
  name: { en: "Ahmed Hassan", ar: "أحمد حسن" },
  phoneLabel: "0111 620 4890",
  phoneHref: "tel:+201116204890",
  whatsappLabel: "0102 508 0764",
  whatsapp: "https://wa.me/201025080764",
  whatsappMessage: {
    en: "Hello Ahmed, I am interested in the primary residences at SODIC East — please send me the price list and payment plan.",
    ar: "أهلاً أحمد، مهتم بالوحدات الأولية في سوديك إيست — من فضلك ابعتلي قائمة الأسعار وخطة السداد.",
  },
};

export const whatsappLink = (c: Contact, lang: Lang) =>
  c.whatsapp + "?text=" + encodeURIComponent(c.whatsappMessage[lang]);
