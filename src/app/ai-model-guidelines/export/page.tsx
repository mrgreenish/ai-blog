import type { Metadata } from "next";
import { SITE_LOCALE, SITE_NAME } from "@/lib/siteConfig";
import { ExportPageClient } from "./ExportPageClient";

const pageTitle = "AI Model Guidelines — SharePoint Export";

export const metadata: Metadata = {
  title: pageTitle,
  description: "Copy HTML for pasting into SharePoint. Data from modelSpecs.ts.",
  openGraph: {
    type: "article",
    siteName: SITE_NAME,
    title: `${pageTitle} | ${SITE_NAME}`,
    url: "/ai-model-guidelines/export",
    locale: SITE_LOCALE,
  },
};

export default function GuidelinesExportPage() {
  return <ExportPageClient />;
}
