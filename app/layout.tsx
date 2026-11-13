import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cairo, Cormorant_Garamond, Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const arabic = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "600"],
});

const siteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Makers Real Estate",
  applicationName: "Makers Real Estate",
  other: {
    "google-adsense-account": "ca-pub-7647429077075381",
    ...(siteVerification ? { "google-site-verification": siteVerification } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#081f18",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = (await headers()).get("x-makers-locale") === "ar" ? "ar" : "en";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${sans.variable} ${serif.variable} ${arabic.variable}`}
    >
      <body>
        <Script id="google-consent-mode-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});`}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7647429077075381"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
