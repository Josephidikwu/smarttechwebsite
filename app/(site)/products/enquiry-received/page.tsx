import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Product Enquiry Received" };

export default function ProductEnquiryReceivedPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">
        Product Enquiry Received.
      </h1>
      <p className="max-w-md text-[var(--color-ink-muted)]">
        We&apos;ve received your request for this product. Our team will review the enquiry and
        contact you with availability, pricing and the next steps.
      </p>
      <Button href="/products" className="mt-4">
        Continue Browsing Products
      </Button>
    </Container>
  );
}
