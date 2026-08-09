import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { site } from "@/lib/brand";
import { getGA4MeasurementId } from "@/lib/settings/site-settings";
import { GA4Script } from "@/components/analytics/ga4-script";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { OrganizationSchema } from "@/components/analytics/organization-schema";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const measurementId = await getGA4MeasurementId();

  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <OrganizationSchema />
        <GA4Script measurementId={measurementId} />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
