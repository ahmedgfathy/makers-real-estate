"use client";

import { useEffect } from "react";

const GTM_SRC = "https://www.googletagmanager.com/gtm.js?id=GTM-NQD7CHB4";
const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7647429077075381";

type GoogleWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __makersGoogleReady?: boolean;
};

/**
 * Consent defaults must exist before the ad tag loads. The tag is appended
 * imperatively so React 19 does not warn about script elements rendered by a
 * client component, and the guards keep both operations to one per document.
 */
export default function GoogleScripts() {
  useEffect(() => {
    const goog = window as GoogleWindow;

    if (!goog.__makersGoogleReady) {
      goog.__makersGoogleReady = true;
      goog.dataLayer = goog.dataLayer || [];
      goog.gtag =
        goog.gtag ||
        function (...args: unknown[]) {
          goog.dataLayer?.push(args);
        };
      goog.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      goog.gtag("js", new Date());
    }

    if (!document.querySelector("script[data-makers-gtm]")) {
      const gtm = document.createElement("script");
      gtm.async = true;
      gtm.src = GTM_SRC;
      gtm.dataset.makersGtm = "true";
      document.head.appendChild(gtm);
    }

    if (document.querySelector("script[data-makers-adsense]")) return;
    const ads = document.createElement("script");
    ads.async = true;
    ads.crossOrigin = "anonymous";
    ads.src = ADSENSE_SRC;
    ads.dataset.makersAdsense = "true";
    document.head.appendChild(ads);
  }, []);

  return null;
}
