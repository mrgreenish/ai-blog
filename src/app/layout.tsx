import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {/* Ambient background glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/4 blur-3xl" />
          <div className="absolute top-1/3 right-0 h-[400px] w-[500px] rounded-full bg-violet-600/3 blur-3xl" />
        </div>
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
