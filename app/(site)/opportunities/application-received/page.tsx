import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ConversionTracker } from "@/components/analytics/conversion-tracker";
import type { ConversionEvent } from "@/lib/analytics/gtag";

export const metadata: Metadata = { title: "Application Received" };

const eventByType: Record<string, ConversionEvent> = {
  training: "training_application",
  internship: "internship_application",
  job: "career_application",
  general: "general_application",
};

export default async function ApplicationReceivedPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const event = type ? eventByType[type] : undefined;

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      {event && <ConversionTracker event={event} />}
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">
        Application Received.
      </h1>
      <p className="max-w-md text-[var(--color-ink-muted)]">
        Thank you for your interest in Smart Technology. We&apos;ve successfully received your
        application. Our team will review your submission and contact you if you are selected for
        the next stage.
      </p>
      <Button href="/opportunities" className="mt-4">
        Back to Opportunities
      </Button>
    </Container>
  );
}
