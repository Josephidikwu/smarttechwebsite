import type { Metadata } from "next";
import { OpportunityStub } from "@/components/sections/opportunity-stub";

export const metadata: Metadata = {
  title: "Technology Training Programmes",
  description:
    "Build the skills you need for the digital world. Explore training opportunities in technology, artificial intelligence, freelancing and related digital disciplines.",
};

export default function TrainingPage() {
  return (
    <OpportunityStub
      eyebrow="Training"
      title="Build Skills. Create Opportunities."
      intro={[
        "Whether you're starting your technology journey or developing existing skills, our training opportunities are designed to support continuous learning.",
      ]}
      listTitle="Areas may include"
      list={[
        "Software development",
        "Web development",
        "Artificial intelligence",
        "Data",
        "Digital skills",
        "Freelancing",
        "Technology",
        "Related digital disciplines",
      ]}
      ctaLabel="Apply for Training"
    />
  );
}
