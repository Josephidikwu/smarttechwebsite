"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { primaryCta, primaryNav } from "@/lib/brand";

/**
 * Clean white nav: translucent white bar, brand-blue logo lockup, minimal
 * link set from lib/brand.ts, one brand-blue primary CTA, clean mobile
 * disclosure.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between py-4">
        <Logo variant="light" />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-brand-blue)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href={primaryCta.href} className="btn-accent !px-5 !py-2.5 !text-sm">
            {primaryCta.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-[var(--color-ink)] transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-[var(--color-ink)] transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-[var(--color-ink)] transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </Container>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-brand-blue-tint)] hover:text-[var(--color-brand-blue)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={primaryCta.href}
              onClick={() => setOpen(false)}
              className="btn-accent mt-3 justify-center"
            >
              {primaryCta.label}
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
