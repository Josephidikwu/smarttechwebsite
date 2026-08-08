import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { QuoteForm } from "@/components/sections/quote-form";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Whether you need technology equipment, software development, IT infrastructure or a digital solution, tell Smart Technology about your requirement.",
};

export default function QuotePage() {
  return (
    <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-5">
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          Request a Quote
        </p>
        <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-[var(--color-ink)]">
          Tell Us What You Need.
        </h1>
        <p className="mt-5 max-w-md text-[var(--color-ink-muted)]">
          Whether you need technology equipment, software development, IT infrastructure or a
          digital solution, tell us about your requirement.
        </p>
      </div>

      <div className="lg:col-span-7">
        <QuoteForm />
      </div>
    </Container>
  );
}
