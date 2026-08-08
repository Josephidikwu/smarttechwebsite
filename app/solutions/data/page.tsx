import type { Metadata } from "next";
import { SolutionPage } from "@/components/sections/solution-page";

export const metadata: Metadata = {
  title: "Data & Analytics",
  description:
    "Smart Technology provides technology capabilities for collecting, managing, processing, analysing and using data to support informed decision-making.",
};

export default function DataPage() {
  return (
    <SolutionPage
      eyebrow="Data & Analytics"
      title="Make better decisions with better data."
      intro={[
        "Data is one of the most valuable resources available to modern organisations.",
        "We provide technology capabilities for collecting, managing, processing, analysing and using data to support informed decision-making.",
      ]}
      capabilities={[
        { name: "Data collection", copy: "Capturing the information that matters to your operations." },
        { name: "Data processing", copy: "Turning raw data into something usable." },
        { name: "Database management", copy: "Structured, reliable storage for business information." },
        { name: "Data analysis", copy: "Finding the signal in the data you already have." },
        { name: "Data science", copy: "Deeper modelling and analysis for complex questions." },
        { name: "Big data analytics", copy: "Working with data at scale." },
        { name: "Business intelligence", copy: "Dashboards and reporting that support decisions." },
        { name: "Digital data management", copy: "Keeping data organised, secure and accessible." },
      ]}
      ctaLabel="Discuss Your Data Needs"
      ctaHref="/contact"
    />
  );
}
