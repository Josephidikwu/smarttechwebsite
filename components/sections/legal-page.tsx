import { Container } from "@/components/ui/container";
import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pt-16 pb-28 lg:pt-24">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-ink)]">{title}</h1>
        <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
          Last updated: placeholder — this draft will be finalised before launch.
        </p>
        <div className="mt-10 flex flex-col gap-5 text-sm leading-relaxed text-[var(--color-ink-muted)] [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--color-ink)]">
          {children}
        </div>
      </Container>
    </section>
  );
}
