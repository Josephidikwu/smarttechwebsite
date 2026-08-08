import type { Metadata } from "next";
import { SolutionPage } from "@/components/sections/solution-page";

export const metadata: Metadata = {
  title: "Technology Procurement",
  description:
    "Smart Technology provides procurement and supply services for technology products and equipment, helping individuals, businesses and organisations source the technology they need.",
};

export default function ProcurementPage() {
  return (
    <SolutionPage
      eyebrow="Technology Procurement"
      title="The right technology. Sourced for you."
      intro={[
        "Finding the right technology shouldn't be complicated. Smart Technology provides procurement and supply services for technology products and equipment, helping individuals, businesses and organisations source the technology they need.",
        "Our procurement capabilities include technology equipment, computers, accessories, networking products and other technology-related products.",
      ]}
      capabilities={[
        { name: "Individual purchases", copy: "Sourcing technology for personal or one-off needs." },
        { name: "Business requirements", copy: "Ongoing technology sourcing for growing teams." },
        { name: "Bulk procurement", copy: "Volume sourcing for larger organisational needs." },
        { name: "Computer & laptop sourcing", copy: "Finding the right devices for the job." },
        { name: "Accessories & peripherals", copy: "Everything that goes around the core device." },
        { name: "Networking equipment", copy: "Hardware for connected environments." },
        { name: "Office technology", copy: "Equipping a workplace end to end." },
        { name: "Special product requests", copy: "Something specific? Tell us and we'll source it." },
      ]}
      ctaLabel="Request a Procurement Quote"
      ctaHref="/quote"
      footnote="The company's registered objects expressly cover procurement, supply, distribution, computer sales and services and ICT-related activities."
    />
  );
}
