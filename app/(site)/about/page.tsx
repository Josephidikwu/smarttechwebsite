import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Smart Technology Information Hub Limited is a Nigerian technology company operating across technology products, procurement, software, artificial intelligence, data, IT infrastructure and digital solutions.",
};

const values = [
  { name: "Innovation", copy: "We remain curious about new technologies and new ways of solving problems." },
  { name: "Excellence", copy: "We aim to deliver quality products, services and experiences." },
  { name: "Integrity", copy: "We believe strong relationships are built on honesty, transparency and trust." },
  { name: "Accessibility", copy: "Technology should create opportunities, not unnecessary barriers." },
  { name: "Growth", copy: "We believe in continuous learning, improvement and development." },
  { name: "Impact", copy: "Technology matters most when it creates meaningful value." },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container>
          <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
            About Us
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Technology With Purpose
          </h1>
          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
            <p className="text-lg text-[var(--color-ink-muted)] lg:col-span-7">
              Smart Technology Information Hub Limited is a Nigerian technology company operating
              across technology products, procurement, software, artificial intelligence, data,
              IT infrastructure and digital solutions.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="text-[var(--color-ink-muted)]">
                Our registered business activities cover a broad technology ecosystem, including
                software development, computer sales and services, data management, AI, website
                development, networking, e-commerce and related digital services.
              </p>
              <p className="mt-4 text-[var(--color-ink-muted)]">
                We believe technology should be practical, accessible and purposeful. Whether
                we&apos;re helping someone find the right device, helping an organisation source
                technology, developing software or exploring new possibilities with artificial
                intelligence, our focus is on creating useful technology solutions.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision / Mission — paired pull-quote statements, distinct from the values grid below. */}
      <section className="mt-20 border-t border-[var(--color-border)] py-20 lg:py-24">
        <Container className="grid gap-12 sm:grid-cols-2 sm:gap-8">
          <div>
            <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              Our Vision
            </p>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              A future where technology creates opportunity for everyone.
            </p>
            <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
              We envision a technology ecosystem that makes digital tools, knowledge and
              opportunities more accessible to people and organisations.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              Our Mission
            </p>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              To provide technology products, digital solutions and opportunities that enable
              people and organisations to work, connect, innovate and grow.
            </p>
          </div>
        </Container>
      </section>

      {/* Values — compact 2-up editorial grid, visually distinct from the single-column lists elsewhere. */}
      <section className="border-t border-[var(--color-border)] py-20 lg:py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            What We Believe
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.name} className="border-t border-[var(--color-border)] pt-5">
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">{v.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{v.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
