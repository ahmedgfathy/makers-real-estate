"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  analyticsEnabled,
  capture,
  capturePageview,
  onConsentRequest,
  readConsent,
  setConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";
import { ui } from "@/lib/labels";

/**
 * Mounts analytics for the whole app: one pageview per route, a delegated
 * listener for every CTA marked with `data-cta`, and the consent prompt that
 * decides whether anything is sent at all. Renders nothing once a choice is
 * stored — the footer link reopens it.
 */
export default function Analytics() {
  const pathname = usePathname();
  const lang = pathname.startsWith("/ar") ? "ar" : "en";
  const [ask, setAsk] = useState(false);

  // Ask once when an analytics provider is configured.
  useEffect(() => {
    setAsk(analyticsEnabled() && readConsent() === null);
  }, []);

  useEffect(() => onConsentRequest(() => setAsk(true)), []);

  useEffect(() => {
    capturePageview();
    const projectMatch = pathname.match(/^\/(?:en|ar)\/projects\/([^/]+)/);
    if (projectMatch) capture("view_project", { project_slug: projectMatch[1] });
  }, [pathname]);

  // Every WhatsApp / call link carries data-cta, so one listener covers them all.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLElement>("[data-cta]");
      if (!link) return;
      capture("contact_clicked", {
        channel: link.dataset.cta,
        surface: link.dataset.ctaSurface ?? "unknown",
        language: lang,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lang]);

  const choose = useCallback((consent: AnalyticsConsent) => {
    setConsent(consent);
    setAsk(false);
    if (consent === "granted") {
      capturePageview();
      const projectMatch = pathname.match(/^\/(?:en|ar)\/projects\/([^/]+)/);
      if (projectMatch) capture("view_project", { project_slug: projectMatch[1] });
    }
  }, [pathname]);

  if (!ask) return null;
  const copy = ui[lang];

  return (
    <aside className="consent" role="region" aria-label={copy.cookies}>
      <p className="consent-text">{copy.consentText}</p>
      <div className="consent-actions">
        <button type="button" className="btn btn--solid btn--sm" onClick={() => choose("granted")}>
          <span>{copy.consentAccept}</span>
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => choose("denied")}>
          <span>{copy.consentDecline}</span>
        </button>
      </div>
    </aside>
  );
}
