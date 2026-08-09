import { site } from "@/lib/brand";

/** Sitewide Organization structured data — see docs SEO requirements. */
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/brand/smart-icon.svg`,
    description: site.shortDescription,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
