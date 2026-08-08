import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a project, technology requirement, procurement request or question? Tell Smart Technology what you need and let's explore how we can help.",
};

export default function ContactPage() {
  return (
    <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-5">
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          Contact
        </p>
        <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-[var(--color-ink)]">
          Let&apos;s Talk Technology.
        </h1>
        <p className="mt-5 max-w-md text-[var(--color-ink-muted)]">
          Have a project, technology requirement, procurement request or question? Tell us what
          you need and let&apos;s explore how we can help.
        </p>
      </div>

      <div className="lg:col-span-7">
        <ContactForm />
      </div>
    </Container>
  );
}
