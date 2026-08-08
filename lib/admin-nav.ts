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
      { label: "Blog / Insights", href: "/admin/insights", available: false }, // M8
      { label: "Media", href: "/admin/media", available: false },
    ],
  },
  {
    heading: "Products",
    items: [
      { label: "Products", href: "/admin/products", available: false }, // M7
      { label: "Categories", href: "/admin/categories", available: false }, // M7
      { label: "Brands", href: "/admin/brands", available: false }, // M7
      { label: "Product Enquiries", href: "/admin/product-enquiries", available: false }, // M7
    ],
  },
  {
    heading: "Opportunities",
    items: [
      { label: "Training", href: "/admin/training", available: false }, // M4
      { label: "Training Applications", href: "/admin/training/applications", available: false }, // M4
      { label: "Internships", href: "/admin/internships", available: false }, // M5
      { label: "Internship Applications", href: "/admin/internships/applications", available: false }, // M5
      { label: "Careers / Jobs", href: "/admin/careers", available: false }, // M6
      { label: "Career Applications", href: "/admin/careers/applications", available: false }, // M6
    ],
  },
  {
    heading: "Communication",
    items: [
      { label: "Contact Enquiries", href: "/admin/contact", available: false }, // M3
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
      { label: "Site Settings", href: "/admin/settings/site", available: false },
      { label: "SEO Settings", href: "/admin/settings/seo", available: false }, // M9
      { label: "Integrations", href: "/admin/settings/integrations", available: false },
    ],
  },
];
