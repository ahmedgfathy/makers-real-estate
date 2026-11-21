import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import Analytics from "@/components/Analytics";
import GoogleScripts from "@/components/GoogleScripts";
import { SITE_URL } from "@/lib/seo";
import "./theme.css";
import "./globals.css";
import "./portal.css";

/**
 * Typefaces are loaded from the Google Fonts CDN (not next/font): Roboto for
 * English, Cairo for Arabic. app/theme.css chooses between them by `lang`.
 */
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap";

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
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_HREF} />
      </head>
      <body>
        <GoogleScripts />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
