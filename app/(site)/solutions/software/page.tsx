import type { Metadata } from "next";
import { SolutionPage } from "@/components/sections/solution-page";

export const metadata: Metadata = {
  title: "Software & Applications",
  description:
    "Smart Technology develops, customises, maintains and improves software, websites, applications and digital platforms built around your business processes.",
};

export default function SoftwarePage() {
  return (
    <SolutionPage
      eyebrow="Software & Applications"
      title="Software that solves real problems."
      intro={[
        "Every organisation has different needs. We develop and customise software around specific requirements rather than forcing businesses into solutions that don't fit.",
        "Our software capabilities include the development, maintenance, upgrading and customisation of applications and digital systems.",
      ]}
      capabilities={[
        { name: "Web Applications", copy: "Digital applications designed around your business processes." },
        { name: "Mobile Applications", copy: "Applications that connect customers, teams and services." },
        { name: "Business Software", copy: "Technology designed to support business operations." },
        { name: "APIs & Integrations", copy: "Connect systems, applications and digital services." },
        { name: "Database Solutions", copy: "Structured systems for managing business information." },
        { name: "E-commerce", copy: "Digital platforms for selling products and services online." },
        { name: "Software Maintenance", copy: "Continuous improvement, upgrades and technical support." },
      ]}
      ctaLabel="Discuss Your Project"
      ctaHref="/contact"
      footnote="These areas are consistent with the software, application, database, web and e-commerce activities registered by the companies."
    />
  );
}
