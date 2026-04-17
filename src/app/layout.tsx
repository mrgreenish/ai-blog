import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_LANGUAGE,
  AUTHOR_NAME,
  AUTHOR_URL,
  AUTHOR_TWITTER,
} from "@/lib/siteConfig";
import "./globals.css";

const sourceSerif = localFont({
  src: "../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "200 900",
  display: "swap",
});
const jetbrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: SITE_NAME }],
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased text-fg-primary bg-bg-page">
        <JsonLd data={websiteJsonLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg-primary focus:shadow-md focus:ring-2 focus:ring-fg-muted"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="relative pt-14">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
