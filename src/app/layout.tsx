import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  title: {
    default: "AI Field Notes",
    template: "%s | AI Field Notes",
  },
  description:
    "Developer field notes on AI tooling: what actually worked, what broke, and what I'd do differently. Interactive tools, workflow recipes, and real benchmarks.",
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
  return (
    <html lang="en" className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen antialiased text-fg-primary bg-bg-page">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg-primary focus:shadow-md focus:ring-2 focus:ring-fg-muted"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="relative pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
