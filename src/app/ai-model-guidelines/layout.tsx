import type { Metadata } from "next";

/** Internal working doc — not for public search or crawling. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AiModelGuidelinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
