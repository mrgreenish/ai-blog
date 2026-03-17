import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});
const jetbrainsMono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});
const spaceGrotesk = localFont({
  src: "../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-display",
  weight: "300 700",
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased text-fg-primary bg-bg-page">
        <ThemeProvider>
          {/* Ambient background glows */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(ellipse, var(--color-ambient-blue) 0%, transparent 70%)" }} />
            <div className="absolute top-1/3 right-0 h-[400px] w-[500px] rounded-full blur-3xl" style={{ background: "radial-gradient(ellipse, var(--color-ambient-violet) 0%, transparent 70%)" }} />
          </div>
          <Header />
          <main className="relative">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
