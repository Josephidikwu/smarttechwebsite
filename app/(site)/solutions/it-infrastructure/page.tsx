import type { Metadata } from "next";
import { SolutionPage } from "@/components/sections/solution-page";

export const metadata: Metadata = {
  title: "IT Infrastructure & Cloud",
  description:
    "Smart Technology's capabilities cover IT infrastructure management, networking, cloud computing, cybersecurity and Software-as-a-Service solutions.",
};

export default function ItInfrastructurePage() {
  return (
    <SolutionPage
      eyebrow="IT Infrastructure & Cloud"
      title="Infrastructure for a connected world."
      intro={[
        "Modern organisations depend on reliable technology infrastructure.",
        "Our capabilities cover IT infrastructure management, networking, cloud computing, cybersecurity and Software-as-a-Service solutions.",
      ]}
      capabilities={[
        { name: "Networking", copy: "Technology for connected environments." },
        { name: "Cloud Computing", copy: "Modern infrastructure and cloud-based services." },
        { name: "Cybersecurity", copy: "Technology solutions focused on protecting digital environments." },
        { name: "IT Infrastructure", copy: "Systems and technology that support business operations." },
        { name: "SaaS", copy: "Cloud-based software and digital services." },
        { name: "Technical Support", copy: "Support for technology systems and digital operations." },
      ]}
      ctaLabel="Talk to an IT Specialist"
      ctaHref="/contact"
      footnote="These capabilities are included within the registered activities of Oracle Digital Infor Hub Ltd."
    />
  );
}
