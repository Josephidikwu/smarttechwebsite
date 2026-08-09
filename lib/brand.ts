/**
 * Central source for site identity, navigation and footer structure — see
 * docs/content-deck.md (copy) and docs/design-direction.md (nav rules: kept
 * minimal, one restrained primary CTA, no overcrowding).
 */

export const site = {
  legalName: "Smart Technology Information Hub Limited",
  shortName: "Smart Technology",
  tagline: "Building Technology. Enabling Possibilities.",
  shortDescription: "Technology Products. Digital Solutions. Opportunities.",
  // Placeholder until a real domain is confirmed — see docs/build plan open items.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Our Companies", href: "/our-companies" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta: NavItem = { label: "Get Started", href: "/contact" };

/**
 * Company contact details (real data supplied by the owner). Displayed in the
 * footer and on the Contact page — always read from here, never hardcode.
 */
export const contact = {
  address: {
    lines: ["Shop D-1, 27 Dawaki Modern Market", "Abuja, FCT"],
    full: "Shop D-1, 27 Dawaki Modern Market, Abuja, FCT",
  },
  email: "smart.tech2047@gmail.com",
  // display = human-readable; tel = E.164 for the tel: link (+234, drop leading 0)
  phones: [
    { display: "0814 834 4052", tel: "+2348148344052" },
    { display: "0816 760 8848", tel: "+2348167608848" },
  ],
} as const;

export type SocialLink = {
  label: string;
  href: string;
  icon: "facebook" | "instagram" | "tiktok";
};

/**
 * Social profiles. hrefs are "#" placeholders until the owner supplies the
 * real profile URLs — just swap the href values here when they arrive.
 */
export const socials: SocialLink[] = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "TikTok", href: "#", icon: "tiktok" },
];

export const footerColumns: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about/our-story" },
      { label: "Our Companies", href: "/our-companies" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Software & Applications", href: "/solutions/software" },
      { label: "AI & Automation", href: "/solutions/ai" },
      { label: "Data & Analytics", href: "/solutions/data" },
      { label: "IT Infrastructure", href: "/solutions/it-infrastructure" },
      { label: "Web & Digital Solutions", href: "/solutions/web-digital" },
      { label: "Technology Procurement", href: "/solutions/procurement" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "Laptops & Computers", href: "/products?category=laptops-computers" },
      { label: "Audio & Headphones", href: "/products?category=audio-headphones" },
      { label: "Accessories", href: "/products?category=accessories" },
      { label: "Networking", href: "/products?category=networking" },
      { label: "Gadgets", href: "/products?category=gadgets" },
    ],
  },
  {
    heading: "Opportunities",
    links: [
      { label: "Training", href: "/opportunities/training" },
      { label: "Internship", href: "/opportunities/internship" },
      { label: "Careers", href: "/opportunities/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Use", href: "/legal/terms-of-use" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
    ],
  },
];
