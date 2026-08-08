import type { Metadata } from "next";
import { SolutionPage } from "@/components/sections/solution-page";

export const metadata: Metadata = {
  title: "Web & Digital Solutions",
  description:
    "Smart Technology provides website development and digital solutions designed to help organisations establish, connect and operate in the digital environment.",
};

export default function WebDigitalPage() {
  return (
    <SolutionPage
      eyebrow="Web & Digital Solutions"
      title="Your business, connected digitally."
      intro={[
        "Your website and digital platforms are often the first point of connection between your organisation and its audience.",
        "We provide website development and digital solutions designed to help organisations establish, connect and operate in the digital environment.",
      ]}
      capabilities={[
        { name: "Website development", copy: "Sites built around how your business actually works." },
        { name: "Web applications", copy: "Interactive tools for customers or internal teams." },
        { name: "Mobile applications", copy: "Reaching people where they already are." },
        { name: "APIs", copy: "Connecting your systems to the wider digital world." },
        { name: "Digital platforms", copy: "Purpose-built systems beyond a single website." },
        { name: "Digital products", copy: "Bringing new digital ideas to life." },
        { name: "E-commerce", copy: "Selling products and services online." },
        { name: "Internet services", copy: "Keeping your digital presence running smoothly." },
        { name: "Digital transformation", copy: "Moving established processes onto modern technology." },
      ]}
      ctaLabel="Start a Digital Project"
      ctaHref="/contact"
    />
  );
}
