"use client";

import posthog from "posthog-js";

/**
 * PostHog product analytics for the site.
 *
 * Capture is opt-in: analytics only starts after the visitor accepts the
 * consent prompt. Do Not Track is respected by PostHog.
 */

export type AnalyticsConsent = "granted" | "denied";

const CONSENT_KEY = "makers.analytics-consent";
const CONSENT_EVENT = "makers:analytics-consent";
const API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const API_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const UI_HOST = API_HOST.replace(".i.posthog.com", ".posthog.com");
const GOOGLE_TAG_MANAGER_ID =
  process.env.NEXT_PUBLIC_GTM_ID === undefined
    ? "GTM-MTG88HJT"
    : process.env.NEXT_PUBLIC_GTM_ID.trim();

type GoogleWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

let initialised = false;
let googleTagManagerInitialised = false;

/** True when an analytics provider is configured. */
export function analyticsEnabled(): boolean {
  return Boolean(API_KEY || GOOGLE_TAG_MANAGER_ID);
}

export function readConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Initialise the SDK once on the client and mirror the stored consent choice.
 * Returns whether capturing is currently allowed.
 */
function ready(): boolean {
  if (typeof window === "undefined" || readConsent() !== "granted") return false;

  if (GOOGLE_TAG_MANAGER_ID) initialiseGoogleTagManager();
  if (!API_KEY) return true;

  if (!initialised) {
    posthog.init(API_KEY, {
      api_host: API_HOST,
      ui_host: UI_HOST,
      persistence: "localStorage+cookie",
      person_profiles: "identified_only",
      capture_pageview: false, // captured per route in components/Analytics.tsx
      capture_pageleave: true,
      respect_dnt: true,
      opt_out_capturing_by_default: true,
    });
    initialised = true;
  }

  if (readConsent() !== "granted") return false;
  if (posthog.get_explicit_consent_status() !== "granted") posthog.opt_in_capturing();
  return true;
}

/** Persist the visitor's choice and apply it immediately. */
export function setConsent(consent: AnalyticsConsent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    /* storage unavailable */
  }

  if (consent === "granted") {
    ready();
    return;
  }

  updateGoogleTagManagerConsent(consent);
  if (!API_KEY) return;
  if (initialised && posthog.get_explicit_consent_status() !== "denied") {
    posthog.opt_out_capturing();
  }
}

function initialiseGoogleTagManager(): void {
  if (!GOOGLE_TAG_MANAGER_ID) return;

  const googleWindow = window as GoogleWindow;
  const dataLayer = googleWindow.dataLayer ?? [];
  googleWindow.dataLayer = dataLayer;

  const gtag = googleWindow.gtag ?? ((...args: unknown[]) => dataLayer.push(args));
  googleWindow.gtag = gtag;

  if (!googleTagManagerInitialised) {
    gtag("consent", "default", deniedGoogleConsent());
    updateGoogleTagManagerConsent("granted");
    gtag("js", new Date());
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_MANAGER_ID}`;
    document.head.appendChild(script);
    googleTagManagerInitialised = true;
    return;
  }

  updateGoogleTagManagerConsent("granted");
}

function updateGoogleTagManagerConsent(consent: AnalyticsConsent): void {
  const googleWindow = window as GoogleWindow;
  googleWindow.gtag?.("consent", "update", {
    analytics_storage: consent === "granted" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function deniedGoogleConsent() {
  return {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

/** Reopen the consent prompt (footer "Cookie preferences"). */
export function requestConsent(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function onConsentRequest(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

/** Capture a product event. Silently no-ops until the visitor has accepted. */
export function capture(event: string, properties?: Record<string, unknown>): void {
  if (!ready()) return;
  if (API_KEY) posthog.capture(event, properties);

  const googleEvent = googleEventFor(event, properties ?? {});
  if (!googleEvent || readConsent() !== "granted" || !GOOGLE_TAG_MANAGER_ID) return;

  const googleWindow = window as GoogleWindow;
  googleWindow.dataLayer?.push({ event: googleEvent.name, ...googleEvent.parameters });
}

export function capturePageview(): void {
  if (typeof window === "undefined") return;
  capture("$pageview", { $current_url: window.location.href });
}

type GoogleEvent = {
  name: "page_view" | "view_project" | "click_whatsapp" | "click_phone" | "generate_lead" | "language_switch";
  parameters: Record<string, string>;
};

function googleEventFor(
  event: string,
  properties: Record<string, unknown>,
): GoogleEvent | null {
  const pathname = window.location.pathname;
  const language = pathname.startsWith("/ar") ? "ar" : "en";

  if (event === "$pageview") {
    if (!/^\/(?:en|ar)(?:\/|$)/.test(pathname)) return null;
    return {
      name: "page_view",
      parameters: {
        page_location: `${window.location.origin}${pathname}`,
        page_path: pathname,
        page_title: document.title,
        language,
      },
    };
  }

  if (event === "view_project") {
    const slug = typeof properties.project_slug === "string" ? properties.project_slug : "";
    if (!slug) return null;
    return {
      name: "view_project",
      parameters: { project_slug: slug, language },
    };
  }

  if (event === "contact_clicked") {
    const channel = properties.channel;
    if (channel !== "whatsapp" && channel !== "phone") return null;
    return {
      name: channel === "whatsapp" ? "click_whatsapp" : "click_phone",
      parameters: {
        cta_location: stringProperty(properties.surface, "unknown"),
        language,
      },
    };
  }

  if (event === "lead_form_submitted") {
    return {
      name: "generate_lead",
      parameters: {
        lead_source: "website",
        project_slug: projectSlug(properties.project),
        form_name: "primary_enquiry",
        language,
      },
    };
  }

  if (event === "language_switched") {
    const nextLanguage = properties.language === "ar" ? "ar" : "en";
    return {
      name: "language_switch",
      parameters: { language: nextLanguage },
    };
  }

  return null;
}

function projectSlug(value: unknown): string {
  if (typeof value !== "string" || !value) return "unspecified";
  if (/sleek/i.test(value)) return "sleek";
  if (/eastvale|إيست فيل|ايست فيل/i.test(value)) return "eastvale";
  if (/the lakes|البحيرات/i.test(value)) return "the-lakes";
  return "unspecified";
}

function stringProperty(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

/** Attach the current browser to a known person (dashboard sessions). */
export function identify(distinctId: string, properties?: Record<string, unknown>): void {
  if (!ready()) return;
  posthog.identify(distinctId, properties);
}

/** Detach the person and the local anonymous id, e.g. on sign-out. */
export function forgetUser(): void {
  if (!initialised) return;
  posthog.reset();
}
