/**
 * Admin sidebar structure — the full information architecture from the
 * build spec, so the URL/nav shape is locked in now even though most
 * sections don't exist until their milestone ships. Unavailable items
 * render muted with a "Soon" tag rather than linking to a 404.
 */
export type AdminNavItem = { label: string; href: string; available: boolean };
export type AdminNavGroup = { heading: string; items: AdminNavItem[] };

export const adminNav: AdminNavGroup[] = [
  {
    heading: "",
    items: [{ label: "Overview", href: "/admin", available: true }],
  },
  {
    heading: "Website",
    items: [
      { label: "Pages", href: "/admin/pages", available: false },
      { label: "Services", href: "/admin/services", available: false },
      { label: "Blog / Insights", href: "/admin/insights", available: true },
      { label: "Media", href: "/admin/media", available: false },
    ],
  },
  {
    heading: "Products",
    items: [
      { label: "Products", href: "/admin/products", available: true },
      { label: "Categories", href: "/admin/categories", available: true },
      { label: "Brands", href: "/admin/brands", available: true },
      { label: "Product Enquiries", href: "/admin/product-enquiries", available: true },
    ],
  },
  {
    heading: "Opportunities",
    items: [
      { label: "Training", href: "/admin/training", available: true },
      { label: "Training Applications", href: "/admin/training/applications", available: true },
      { label: "Internships", href: "/admin/internships", available: true },
      { label: "Internship Applications", href: "/admin/internships/applications", available: true },
      { label: "Careers / Jobs", href: "/admin/careers", available: true },
      { label: "Career Applications", href: "/admin/careers/applications", available: true },
      { label: "General Applications", href: "/admin/careers/general", available: true },
    ],
  },
  {
    heading: "Communication",
    items: [
      { label: "Contact Enquiries", href: "/admin/contact", available: true },
      { label: "Notifications", href: "/admin/notifications", available: false },
    ],
  },
  {
    heading: "Analytics",
    items: [{ label: "Website Analytics", href: "/admin/analytics", available: false }], // M9
  },
  {
    heading: "Settings",
    items: [
      { label: "Users", href: "/admin/settings/users", available: true },
      { label: "Email (Webmail)", href: "/admin/settings/email", available: true },
      { label: "Site Settings", href: "/admin/settings/site", available: false },
      { label: "SEO Settings", href: "/admin/settings/seo", available: false }, // M9
      { label: "Integrations", href: "/admin/settings/integrations", available: true },
    ],
  },
];
