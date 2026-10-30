"use client";

import posthog from "posthog-js";

/**
 * PostHog product analytics for the site.
 *
 * Capture is opt-in: the SDK starts opted out and only sends once the visitor
 * accepts the analytics prompt (remembered under `makers.analytics-consent`,
 * next to `makers.lang`). Do Not Track is respected. Without
 * NEXT_PUBLIC_POSTHOG_KEY every helper here is a no-op, so local builds and
 * previews stay quiet.
 */

export type AnalyticsConsent = "granted" | "denied";

const CONSENT_KEY = "makers.analytics-consent";
const CONSENT_EVENT = "makers:analytics-consent";
const API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const API_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const UI_HOST = API_HOST.replace(".i.posthog.com", ".posthog.com");

let initialised = false;

/** True when a project key is configured at build time. */
export function analyticsEnabled(): boolean {
  return Boolean(API_KEY);
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
  if (typeof window === "undefined" || !API_KEY) return false;

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
  if (!API_KEY) return;
  if (consent === "granted") {
    ready();
    return;
  }
  if (initialised && posthog.get_explicit_consent_status() !== "denied") {
    posthog.opt_out_capturing();
  }
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
  posthog.capture(event, properties);
}

export function capturePageview(): void {
  if (typeof window === "undefined") return;
  capture("$pageview", { $current_url: window.location.href });
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
