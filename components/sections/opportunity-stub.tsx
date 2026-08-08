import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

/**
 * Descriptive top-of-page content for Training/Internship/Careers, routed to
 * the general contact form for now. The real multi-field application flow
 * (DB-backed, file upload, admin pipeline) is scoped to M4/M5/M6 — this
 * keeps the nav fully functional without duplicating that work early.
 */
export function OpportunityStub({
  eyebrow,
  title,
  intro,
  listTitle,
  list,
  ctaLabel,
}: {
  eyebrow: string;
  title: string;
  intro: string[];
  listTitle: string;
  list: string[];
  ctaLabel: string;
}) {
  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
              {title}
            </h1>
            {intro.map((p, i) => (
              <p key={i} className="mt-5 max-w-xl text-[var(--color-ink-muted)]">
                {p}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-ink)] uppercase">
            {listTitle}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((item) => (
              <li key={item} className="text-sm text-[var(--color-ink-muted)]">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-16">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-semibold text-[var(--color-ink)]">Ready to get started?</p>
            <p className="mt-1 max-w-md text-sm text-[var(--color-ink-muted)]">
              Applications aren&apos;t open online just yet — reach out and tell us about
              yourself, and we&apos;ll take it from there.
            </p>
          </div>
          <Button href="/contact">{ctaLabel}</Button>
        </Container>
      </section>
    </>
  );
}
