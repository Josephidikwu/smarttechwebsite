import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ink)]">
        We couldn&apos;t find that page.
      </h1>
      <p className="max-w-md text-[var(--color-ink-muted)]">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <div className="mt-4 flex gap-4">
        <Button href="/">Return Home</Button>
        <Button href="/contact" variant="secondary">
          Contact Us
        </Button>
      </div>
    </Container>
  );
}
