import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "inverse" | "text";

const base =
  "inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "rounded-md bg-[var(--color-brand-blue)] px-5 py-2.5 text-white hover:bg-[var(--color-brand-blue-dark)]",
  secondary:
    "rounded-md border border-[var(--color-ink)] px-5 py-2.5 text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)]",
  /** For use on the brand-blue or dark sections — solid white, never stacked with bg-* overrides. */
  inverse: "rounded-md bg-white px-5 py-2.5 text-[var(--color-brand-blue)] hover:bg-white/90",
  text: "text-[var(--color-brand-blue)] underline-offset-4 hover:underline",
};

type BaseProps = { variant?: Variant; children: ReactNode; className?: string };

/** Renders as a Next.js `<Link>` when `href` is given, a `<button>` otherwise. */
export function Button(
  props: BaseProps &
    ({ href: LinkProps["href"] } | { href?: undefined; type?: ButtonHTMLAttributes<HTMLButtonElement>["type"] }),
) {
  const { variant = "primary", children, className = "" } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes}>
      {children}
    </button>
  );
}
