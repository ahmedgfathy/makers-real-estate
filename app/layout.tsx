import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cairo, Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import { getSite } from "@/lib/content-db";
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

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSite();
  const meta = content.en.meta;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: meta.title,
    description: meta.description,
    applicationName: "Makers Real Estate",
    keywords: [
      "SODIC East",
      "The Lakes",
      "EastVale",
      "New Heliopolis",
      "primary units",
      "Makers Real Estate",
      "apartments East Cairo",
    ],
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      images: ["/img/lakes-pool.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/img/lakes-pool.jpg"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#081f18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${sans.variable} ${serif.variable} ${arabic.variable}`}
    >
      <body>
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
