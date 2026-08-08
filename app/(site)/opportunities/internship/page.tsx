import type { Metadata } from "next";
import { OpportunityStub } from "@/components/sections/opportunity-stub";

export const metadata: Metadata = {
  title: "Technology Internship Programme",
  description:
    "Gain practical exposure, develop workplace skills and learn by contributing to real technology projects at Smart Technology.",
};

export default function InternshipPage() {
  return (
    <OpportunityStub
      eyebrow="Internship"
      title="Learn By Doing."
      intro={[
        "Knowledge is powerful. Experience makes it practical.",
        "Our internship opportunities are designed to give aspiring professionals exposure to technology, teamwork and the workplace while developing practical skills.",
      ]}
      listTitle="Areas of interest"
      list={[
        "Software Development",
        "Web Development",
        "Artificial Intelligence",
        "Data",
        "UI/UX",
        "IT & Infrastructure",
        "Digital Marketing",
        "Business Operations",
      ]}
      ctaLabel="Apply for Internship"
    />
  );
}
