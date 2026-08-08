import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export type Capability = { name: string; copy: string };

/**
 * Shared shell for the 6 solution pages — a deliberate internal template
 * (they're one family of pages), but built as an editorial list rather
 * than the generic 3-card pattern the design brief bans. See
 * docs/design-direction.md.
 */
export function SolutionPage({
  eyebrow,
  title,
  intro,
  capabilities,
  ctaLabel,
  ctaHref,
  footnote,
}: {
  eyebrow: string;
  title: string;
  intro: string[];
  capabilities: Capability[];
  ctaLabel: string;
  ctaHref: string;
  footnote?: string;
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
            <div className="mt-6 flex flex-col gap-4">
              {intro.map((p, i) => (
                <p key={i} className="max-w-xl text-[var(--color-ink-muted)]">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <Button href={ctaHref}>{ctaLabel}</Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid divide-y divide-[var(--color-border)] border-t border-[var(--color-border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.name} className="py-7 sm:px-8 sm:py-9 sm:first:pl-0">
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">{c.name}</h2>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{c.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {footnote && (
        <section className="pb-20 lg:pb-28">
          <Container>
            <p className="max-w-2xl border-l-2 border-[var(--color-brand-blue)] pl-5 text-sm text-[var(--color-ink-muted)] italic">
              {footnote}
            </p>
          </Container>
        </section>
      )}

      <section className="border-t border-[var(--color-border)] py-16">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-xl font-semibold text-[var(--color-ink)]">
            Let&apos;s build what&apos;s next.
          </p>
          <Link
            href="/contact"
            className="text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
          >
            Get Started →
          </Link>
        </Container>
      </section>
    </>
  );
}
