import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { GeneralApplicationForm } from "@/components/sections/general-application-form";

export const metadata: Metadata = {
  title: "General Application",
  description:
    "We're always interested in meeting talented people. Submit a general application and tell Smart Technology how you could contribute.",
};

export default function GeneralApplicationPage() {
  return (
    <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-5">
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          General Application
        </p>
        <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-[var(--color-ink)]">
          Don&apos;t See The Right Role?
        </h1>
        <p className="mt-5 max-w-md text-[var(--color-ink-muted)]">
          We&apos;re always interested in meeting talented people. Submit a general application
          and tell us how you could contribute.
        </p>
      </div>

      <div className="lg:col-span-7">
        <GeneralApplicationForm />
      </div>
    </Container>
  );
}
