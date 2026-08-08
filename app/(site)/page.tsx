import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeroGraphic } from "@/components/sections/home/hero-graphic";
import {
  AccessoryIcon,
  GadgetIcon,
  HeadphonesIcon,
  LaptopIcon,
  NetworkingIcon,
} from "@/components/ui/category-icons";
import { pillars } from "@/lib/content/pillars";

const categories = [
  { name: "Laptops & Computers", Icon: LaptopIcon },
  { name: "Audio & Headphones", Icon: HeadphonesIcon },
  { name: "Accessories", Icon: AccessoryIcon },
  { name: "Networking", Icon: NetworkingIcon },
  { name: "Gadgets", Icon: GadgetIcon },
];

const aiCapabilities = [
  "AI Applications",
  "Automation",
  "Machine Learning",
  "AI Chatbots",
  "Predictive Analytics",
  "AI-Powered Tools",
];

const opportunities = [
  {
    name: "Training",
    copy: "Build the skills you need for the digital world.",
    href: "/opportunities/training",
    cta: "Apply for Training",
  },
  {
    name: "Internship",
    copy: "Turn knowledge into experience.",
    href: "/opportunities/internship",
    cta: "Apply for Internship",
  },
  {
    name: "Careers",
    copy: "Build your future with us.",
    href: "/opportunities/careers",
    cta: "Explore Careers",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero — strong typography + editorial graphic, large negative space.
          No gradient blob / floating UI cards / pill-button pair. */}
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-28">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              Technology Products. Digital Solutions. Opportunities.
            </p>
            <h1 className="mt-4 text-5xl leading-[1.05] font-bold tracking-tight text-[var(--color-ink)] sm:text-6xl">
              Building Technology.
              <br />
              Enabling Possibilities.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-muted)]">
              Smart Technology connects people and organisations with the technology products,
              digital solutions and opportunities they need to work, innovate and grow.
            </p>
            <p className="mt-4 max-w-xl text-[var(--color-ink-muted)]">
              From laptops and technology equipment to software, artificial intelligence, data
              and IT infrastructure, we bring practical technology solutions together under one
              ecosystem.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/solutions">Explore Our Solutions</Button>
              <Button href="/products" variant="secondary">
                Explore Products
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <HeroGraphic />
          </div>
        </Container>
      </section>

      {/* Introduction — large typographic statement, asymmetric 40/60, text link not a button. */}
      <section className="border-t border-[var(--color-border)] py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Technology should create possibilities.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[var(--color-ink-muted)]">
              Technology is more than hardware or software. It is how businesses operate, how
              people connect, how problems are solved and how new opportunities are created.
            </p>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              Smart Technology Information Hub Limited provides technology products, procurement
              services and digital solutions across software, artificial intelligence, data, IT
              infrastructure, websites, applications and digital platforms.
            </p>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              We also create opportunities for people to learn, gain experience and build careers
              in technology.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
            >
              Discover Smart Technology →
            </Link>
          </div>
        </Container>
      </section>

      {/* What We Do — editorial index list, not a card grid. */}
      <section className="border-t border-[var(--color-border)] py-20 lg:py-28">
        <Container>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Technology for the way you live, work and grow.
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-ink-muted)]">
            We bring together technology products, digital solutions and professional services to
            meet the evolving needs of individuals, businesses and organisations.
          </p>

          <div className="mt-14 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {pillars.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group flex flex-col gap-2 py-7 sm:flex-row sm:items-center sm:gap-8"
              >
                <span className="text-sm font-medium text-[var(--color-ink-muted)] sm:w-10">
                  {p.n}
                </span>
                <span className="text-xl font-semibold text-[var(--color-ink)] sm:w-72 sm:shrink-0">
                  {p.name}
                </span>
                <span className="text-sm text-[var(--color-ink-muted)] sm:flex-1">{p.copy}</span>
                <span className="text-sm font-medium text-[var(--color-brand-blue)] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  {p.cta} →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Products — full-width minimal category strip, distinct from the list above. */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20 lg:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="max-w-md text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Technology you&apos;ll want to use.
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
            >
              Explore Products →
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-5">
            {categories.map(({ name, Icon }) => (
              <div key={name} className="flex flex-col gap-4 bg-[var(--color-bg)] p-7">
                <Icon className="h-7 w-7 text-[var(--color-brand-blue)]" />
                <span className="text-sm font-medium text-[var(--color-ink)]">{name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* AI — the one deliberate dark, immersive moment on the homepage. */}
      <section className="section-dark py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Intelligence is changing what&apos;s possible.
            </h2>
            <p className="mt-5 max-w-md text-[var(--color-dark-ink-muted)]">
              Artificial intelligence is creating new ways to automate processes, understand
              information and build better digital experiences. We develop and deploy intelligent
              technology solutions across AI, machine learning, automation, chatbots and
              predictive analytics.
            </p>
            <Link
              href="/solutions/ai"
              className="mt-6 inline-flex text-sm font-medium text-white underline-offset-4 hover:underline"
            >
              Talk to Us About AI →
            </Link>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-dark-border)] pt-6">
              {aiCapabilities.map((c) => (
                <li key={c} className="text-sm text-[var(--color-dark-ink-muted)]">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Story — confident, mature, two-column. */}
      <section className="border-t border-[var(--color-border)] py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              Our story
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Technology with purpose.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[var(--color-ink-muted)]">
              Smart Technology Information Hub Limited is a Nigerian technology company operating
              across technology products, procurement, software, artificial intelligence, data,
              IT infrastructure and digital solutions.
            </p>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              We believe technology should be practical, accessible and purposeful — whether
              we&apos;re helping someone find the right device, developing software, or exploring
              new possibilities with artificial intelligence.
            </p>
            <Link
              href="/about/our-story"
              className="mt-6 inline-flex text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
            >
              Read our story →
            </Link>
          </div>
        </Container>
      </section>

      {/* Opportunities — human, aspirational, typography-led (not 3 identical cards). */}
      <section className="border-t border-[var(--color-border)] py-20 lg:py-28">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Learn. Experience. Build.
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-ink-muted)]">
            Technology creates opportunities when people have the knowledge, skills and
            experience to participate. Smart Technology provides pathways for people who want to
            learn technology, gain practical experience and build careers.
          </p>

          <div className="mt-14 grid divide-y divide-[var(--color-border)] border-t border-[var(--color-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {opportunities.map((o) => (
              <div key={o.name} className="flex flex-col gap-3 py-8 sm:px-8 sm:py-0 sm:first:pl-0">
                <h3 className="text-xl font-semibold text-[var(--color-ink)]">{o.name}</h3>
                <p className="text-sm text-[var(--color-ink-muted)]">{o.copy}</p>
                <Link
                  href={o.href}
                  className="mt-1 text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
                >
                  {o.cta} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA — used once, at the very end, per the design brief. */}
      <section className="bg-[var(--color-brand-blue)] py-20 text-center lg:py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Let&apos;s Build What&apos;s Next.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Whether you need the right technology, a digital solution, an AI-powered system,
            professional technology support or an opportunity to develop your skills, we&apos;re
            ready to connect you with what&apos;s next.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="inverse">
              Get Started
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
