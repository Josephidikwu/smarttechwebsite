import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { pillars } from "@/lib/content/pillars";

/* ------------------------------------------------------------------ */
/* Content — adapted to Smart Technology's own brand, structured after  */
/* the lorolabs.ai editorial art direction (dark, bold, image-led).     */
/* ------------------------------------------------------------------ */

const serviceCards = [
  {
    name: "Software & Applications",
    copy: "We design, build, customise and maintain software, websites, applications and digital platforms.",
    href: "/solutions/software",
    img: "/images/service-web.jpg",
    tag: "Build",
  },
  {
    name: "Artificial Intelligence",
    copy: "AI applications, machine learning, automation, chatbots and predictive analytics that move your business forward.",
    href: "/solutions/ai",
    img: "/images/service-ai.jpg",
    tag: "Automate",
  },
  {
    name: "IT Infrastructure",
    copy: "Networking, cloud computing, cybersecurity and Software-as-a-Service — infrastructure engineered to last.",
    href: "/solutions/it-infrastructure",
    img: "/images/service-systems.jpg",
    tag: "Operate",
  },
  {
    name: "Data & Analytics",
    copy: "Data collection, database management, data science, big-data analytics and business intelligence.",
    href: "/solutions/data",
    img: "/images/service-data.jpg",
    tag: "Understand",
  },
  {
    name: "Technology Products",
    copy: "Laptops, computers, headphones, accessories, networking equipment and the gadgets you'll actually want to use.",
    href: "/products",
    img: "/images/service-app.jpg",
    tag: "Equip",
  },
  {
    name: "Technology Procurement",
    copy: "Sourcing, procurement and supply for individuals, businesses and organisations — done properly.",
    href: "/solutions/procurement",
    img: "/images/service-procurement.jpg",
    tag: "Source",
  },
];

const stats = [
  { value: "6", label: "Solution areas under one roof" },
  { value: "3", label: "Opportunity pathways for talent" },
  { value: "1", label: "Connected technology ecosystem" },
];

const stack = [
  "Web",
  "Mobile",
  "Cloud",
  "AI / ML",
  "Automation",
  "Databases",
  "Analytics",
  "Cybersecurity",
  "Networking",
  "APIs",
  "SaaS",
  "DevOps",
];

const differentiators = [
  {
    title: "We Listen First",
    copy: "We start by understanding your goals, your people and your constraints — before a single line of code or a single quote.",
  },
  {
    title: "One Team, One Conversation",
    copy: "Products, software, AI, data and infrastructure under one roof means no hand-offs and no finger-pointing.",
  },
  {
    title: "Practical & Transparent",
    copy: "Honest scoping and clear advice. We recommend what actually solves the problem — not what's easiest to sell.",
  },
  {
    title: "Built to Last",
    copy: "Everything we deliver is engineered to keep working after we leave, with support and skills that stay with you.",
  },
];

const engagements = [
  { name: "Technology Products & Devices", note: "Laptops, computers, audio, accessories, networking", cta: "Browse Products", href: "/products" },
  { name: "Procurement & Supply", note: "Sourcing and supply for teams and organisations", cta: "Request a Quote", href: "/quote" },
  { name: "Software, Websites & Apps", note: "From landing pages to full digital platforms", cta: "Start a Project", href: "/solutions/software" },
  { name: "AI, Data & Automation", note: "Intelligent systems and analytics", cta: "Talk to Us", href: "/solutions/ai" },
  { name: "IT Infrastructure & Cloud", note: "Networking, cloud, cybersecurity, SaaS", cta: "Get a Quote", href: "/solutions/it-infrastructure" },
];

const industries = [
  "Individuals & Professionals",
  "Startups & SMEs",
  "Enterprises",
  "Education",
  "Public Sector",
  "Healthcare",
  "Finance & Fintech",
  "Retail & Commerce",
];

export default function Home() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        {/* full-bleed image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-portrait.jpg"
            alt="A technology professional at work in a modern data centre"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70 lg:object-[70%_center]"
          />
          {/* gradient overlays for readability + crimson accent glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-[#0b0b0b]/40" />
          <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[var(--accent)] opacity-25 blur-[130px]" />
        </div>

        <Container className="relative flex min-h-[92vh] flex-col justify-center py-28 lg:min-h-screen">
          <div className="max-w-3xl">
            <p className="loro-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-[var(--text-secondary)] uppercase backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-hover)]" />
              Technology Products · Digital Solutions · Opportunities
            </p>
            <h1 className="loro-display loro-fade-up loro-delay-1 text-[clamp(3rem,7vw,6rem)]">
              Building technology.
              <br />
              <span className="text-[var(--accent-hover)]">Enabling</span> possibilities.
            </h1>
            <p className="loro-fade-up loro-delay-2 mt-8 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
              Smart Technology connects people and organisations with the products, digital
              solutions and talent they need to work, innovate and grow — from devices and
              infrastructure to software, artificial intelligence and data.
            </p>
            <div className="loro-fade-up loro-delay-3 mt-10 flex flex-wrap items-center gap-4">
              <Link href="/solutions" className="btn-accent">
                Explore Our Solutions
                <span aria-hidden>→</span>
              </Link>
              <Link href="/products" className="btn-ghost">
                Explore Products
              </Link>
            </div>
          </div>
        </Container>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[var(--text-muted)] lg:flex">
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
        </div>
      </section>

      {/* ================= ABOUT STRIP ================= */}
      <section className="bg-[var(--color-bg)] py-24 lg:py-32">
        <Container className="text-center">
          <p className="text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">
            Why we exist
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
            Technology is more than hardware or software. It&apos;s how businesses operate, how
            people connect, and how new possibilities are created.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg text-[var(--color-ink-muted)]">
            Smart Technology Information Hub Limited brings technology products, procurement and
            digital solutions together under one ecosystem — and creates opportunities for people
            to learn, gain experience and build careers in technology.
          </p>
        </Container>
      </section>

      {/* ================= SERVICES CARDS ================= */}
      <section className="bg-[var(--bg)] py-24 text-[var(--text)] lg:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold tracking-widest text-[var(--accent-hover)] uppercase">
                What we do
              </p>
              <h2 className="loro-display mt-4 max-w-2xl text-4xl sm:text-5xl">
                Technology for the way you live, work and grow.
              </h2>
            </div>
            <Link
              href="/solutions"
              className="shrink-0 text-sm font-semibold text-[var(--text-secondary)] underline-offset-4 transition hover:text-white hover:underline"
            >
              View all solutions →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((s) => (
              <Link key={s.name} href={s.href} className="loro-card group block h-80">
                <Image
                  src={s.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="loro-card-img object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/55 to-[#0a0a0a]/10" />
                <div className="relative flex h-full flex-col justify-end p-7">
                  <span className="mb-3 w-fit rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 uppercase backdrop-blur">
                    {s.tag}
                  </span>
                  <h3 className="text-2xl font-bold">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {s.copy}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-[var(--accent-hover)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= PHILOSOPHY / PULL-QUOTE + STATS ================= */}
      <section className="bg-[var(--color-bg)] py-24 lg:py-32">
        <Container className="text-center">
          <svg
            className="mx-auto mb-8 h-10 w-10 text-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 017.17 9.5V6zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H15.5a1.67 1.67 0 011.67-1.67V6z" />
          </svg>
          <blockquote className="mx-auto max-w-4xl text-2xl font-semibold leading-snug tracking-tight text-[var(--color-ink)] sm:text-3xl lg:text-4xl">
            &ldquo;Technology should be practical, accessible and purposeful — whether we&apos;re
            helping someone find the right device, building software, or exploring what&apos;s
            possible with artificial intelligence.&rdquo;
          </blockquote>
          <p className="mt-8 text-sm font-medium text-[var(--color-ink-muted)]">
            Smart Technology Information Hub Limited — our philosophy
          </p>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {stats.map((st) => (
              <div key={st.label}>
                <div className="loro-display text-5xl text-[var(--accent)] sm:text-6xl">
                  {st.value}
                </div>
                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{st.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24 lg:py-28">
        <Container className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            A modern, production-grade stack.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-ink-muted)]">
            We work across the technologies that power real, resilient digital products — chosen
            to fit the problem, not the trend.
          </p>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
            {stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {t}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= FULL-BLEED EDITORIAL IMAGE ================= */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Image
          src="/images/editorial.jpg"
          alt="A connected world seen from above at night"
          fill
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <Container className="relative py-28">
          <p className="text-sm font-semibold tracking-widest text-[var(--accent-hover)] uppercase">
            Artificial Intelligence
          </p>
          <h2 className="loro-display mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
            Intelligence is changing what&apos;s possible.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-[var(--text-secondary)]">
            We develop and deploy intelligent technology across AI, machine learning, automation,
            chatbots and predictive analytics — new ways to automate processes, understand
            information and build better digital experiences.
          </p>
          <Link href="/solutions/ai" className="btn-accent mt-9">
            Talk to Us About AI <span aria-hidden>→</span>
          </Link>
        </Container>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-[var(--bg)] py-24 text-[var(--text)] lg:py-32">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-[var(--accent-hover)] uppercase">
              Why it matters
            </p>
            <h2 className="loro-display mt-4 text-4xl sm:text-5xl">
              Built around your business — not ours.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {differentiators.map((d, i) => (
              <div
                key={d.title}
                className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 transition hover:border-[var(--accent)]/50"
              >
                <span className="loro-display text-3xl text-[var(--accent)]">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold">{d.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{d.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= WAYS TO WORK / PRICING-STYLE LIST ================= */}
      <section className="bg-[var(--color-bg)] py-24 lg:py-32">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">
              Build &amp; operate
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
              Ways to work with Smart Technology.
            </h2>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              Every engagement is scoped to your needs. Tell us what you&apos;re trying to achieve
              and we&apos;ll shape the right mix of products, solutions and support.
            </p>
          </div>

          <div className="mt-14 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {engagements.map((e) => (
              <div
                key={e.name}
                className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-ink)]">{e.name}</h3>
                  <p className="text-sm text-[var(--color-ink-muted)]">{e.note}</p>
                </div>
                <Link
                  href={e.href}
                  className="shrink-0 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {e.cta} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= INDUSTRIES ================= */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24 lg:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="max-w-md text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Built for every kind of organisation.
            </h2>
            <p className="max-w-sm text-sm text-[var(--color-ink-muted)]">
              From individuals choosing their next device to enterprises modernising their
              infrastructure — the same ecosystem, tailored to you.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
            {industries.map((ind) => (
              <div
                key={ind}
                className="flex min-h-28 items-center bg-[var(--color-bg)] p-6 text-base font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-bg-subtle)]"
              >
                {ind}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= OPPORTUNITIES ================= */}
      <section className="bg-[var(--color-bg)] py-24 lg:py-28">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-[var(--accent)] uppercase">
              Opportunities
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Learn. Experience. Build.
            </h2>
            <p className="mt-4 text-[var(--color-ink-muted)]">
              Technology creates opportunities when people have the knowledge, skills and
              experience to participate. We provide the pathways.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { name: "Training", copy: "Build the skills you need for the digital world.", href: "/opportunities/training", cta: "Apply for Training" },
              { name: "Internship", copy: "Turn knowledge into real experience.", href: "/opportunities/internship", cta: "Apply for Internship" },
              { name: "Careers", copy: "Build your future with us.", href: "/opportunities/careers", cta: "Explore Careers" },
            ].map((o) => (
              <div
                key={o.name}
                className="rounded-2xl border border-[var(--color-border)] p-8 transition hover:border-[var(--accent)] hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-[var(--color-ink)]">{o.name}</h3>
                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{o.copy}</p>
                <Link
                  href={o.href}
                  className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {o.cta} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Image
          src="/images/cta.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b]/90 via-[#0b0b0b]/85 to-[#0b0b0b]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-20 blur-[120px]" />
        <Container className="relative py-28 text-center lg:py-36">
          <h2 className="loro-display mx-auto max-w-3xl text-[clamp(2.5rem,6vw,5rem)]">
            Ready to build what&apos;s next?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--text-secondary)]">
            Whether you need the right technology, a digital solution, an AI-powered system, or an
            opportunity to develop your skills — we&apos;re ready to connect you with what&apos;s
            next.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-accent">
              Get Started <span aria-hidden>→</span>
            </Link>
            <Link href="/quote" className="btn-ghost">
              Request a Quote
            </Link>
          </div>
        </Container>
      </section>

      {/* keep the pillars import meaningful for type-safety / future use */}
      <span className="hidden" aria-hidden data-pillars={pillars.length} />
    </>
  );
}
