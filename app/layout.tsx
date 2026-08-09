import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/brand";
import { GA4Script } from "@/components/analytics/ga4-script";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { OrganizationSchema } from "@/components/analytics/organization-schema";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | ${site.tagline}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.shortDescription,
  openGraph: {
    title: `${site.legalName} | ${site.tagline}`,
    description: site.shortDescription,
    url: site.url,
    siteName: site.shortName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.legalName} | ${site.tagline}`,
    description: site.shortDescription,
  },
};

/**
 * True root: html/body/fonts/base metadata only. Marketing chrome
 * (header/footer) lives in app/(site)/layout.tsx — the admin dashboard
 * under app/admin/ intentionally does not get it.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <OrganizationSchema />
        <GA4Script />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
