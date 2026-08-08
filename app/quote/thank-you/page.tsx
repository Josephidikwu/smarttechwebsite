import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Quote request received" };

export default function QuoteThankYouPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">
        Thanks for reaching out.
      </h1>
      <p className="max-w-md text-[var(--color-ink-muted)]">
        We&apos;ve received your enquiry and a member of our team will review it and get back to
        you.
      </p>
      <Button href="/" className="mt-4">
        Return Home
      </Button>
    </Container>
  );
}
