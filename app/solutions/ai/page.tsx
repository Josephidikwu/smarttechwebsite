import type { Metadata } from "next";
import { SolutionPage } from "@/components/sections/solution-page";

export const metadata: Metadata = {
  title: "Artificial Intelligence",
  description:
    "Smart Technology develops and deploys intelligent technology solutions across AI, machine learning, automation, chatbots and predictive analytics.",
};

export default function AiPage() {
  return (
    <SolutionPage
      eyebrow="Artificial Intelligence"
      title="Intelligence is changing what's possible."
      intro={[
        "Artificial intelligence is creating new ways to automate processes, understand information and build better digital experiences.",
        "We develop and deploy intelligent technology solutions across artificial intelligence, machine learning, automation, chatbots and predictive analytics.",
      ]}
      capabilities={[
        { name: "AI Applications", copy: "Intelligent digital solutions built around specific needs." },
        { name: "Automation", copy: "Reduce repetitive processes and create more efficient workflows." },
        { name: "Machine Learning", copy: "Technology that learns from data to support intelligent outcomes." },
        {
          name: "AI Chatbots",
          copy: "Conversational systems designed to interact with users and provide information or assistance.",
        },
        { name: "Predictive Analytics", copy: "Use data to identify patterns and support better decisions." },
        { name: "AI-Powered Tools", copy: "Explore new ways to integrate intelligence into digital products." },
      ]}
      ctaLabel="Talk to Us About AI"
      ctaHref="/contact"
      footnote="The AI, machine learning, automation, chatbot and predictive analytics capabilities are specifically reflected in Oracle Digital Infor Hub Ltd's registered objects."
    />
  );
}
