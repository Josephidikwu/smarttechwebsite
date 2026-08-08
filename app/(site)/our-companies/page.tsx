import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Our Companies",
  description:
    "Smart Technology's ecosystem brings together complementary capabilities across software, artificial intelligence, data, digital platforms, IT services and technology products.",
};

export default function OurCompaniesPage() {
  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container>
          <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
            Technology Ecosystem
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            More than one company. One broader technology vision.
          </h1>
          <p className="mt-6 max-w-xl text-[var(--color-ink-muted)]">
            Our technology ecosystem brings together complementary capabilities across software,
            artificial intelligence, data, digital platforms, IT services and technology products.
          </p>
        </Container>
      </section>

      {/* Editorial split — not two company cards. */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="py-10 sm:pr-12 sm:py-2">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                Smart Technology
              </h2>
              <p className="mt-1 text-sm font-medium text-[var(--color-brand-blue)]">
                Technology Products &amp; Digital Solutions
              </p>
              <p className="mt-5 text-[var(--color-ink-muted)]">
                Smart Technology Information Hub Limited operates across technology products and
                procurement, software, IT solutions, data, websites, applications, networking,
                e-commerce and digital services.
              </p>
              <Link
                href="/solutions"
                className="mt-6 inline-flex text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
              >
                Explore Smart Technology →
              </Link>
            </div>

            <div className="py-10 sm:py-2 sm:pl-12">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                Oracle Digital
              </h2>
              <p className="mt-1 text-sm font-medium text-[var(--color-brand-blue)]">
                AI, Software &amp; Digital Innovation
              </p>
              <p className="mt-5 text-[var(--color-ink-muted)]">
                Oracle Digital Infor Hub Ltd operates within the information and communication
                sector, with registered activities covering computer programming, consultancy, AI
                solutions, software development, data science, digital transformation, cloud
                computing, cybersecurity, SaaS, digital products and technology training.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
              >
                Get in touch to learn more →
              </Link>
            </div>
          </div>

          <p className="mt-14 max-w-2xl text-xs text-[var(--color-ink-muted)]">
            The companies within our technology ecosystem operate as separately registered
            entities. Information presented on this page describes their respective areas of
            activity.
          </p>
        </Container>
      </section>
    </>
  );
}
