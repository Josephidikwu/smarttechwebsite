import Image from "next/image";
import Link from "next/link";

/**
 * Brand lockup: the circuit-chip mark (icon-only crop of the supplied logo)
 * set beside a two-line typeset wordmark — "SMART TECHNOLOGY" over
 * "DIGITAL INFORMATION HUB" in tracked caps, mirroring the real logo.
 *
 * Responsive by default (icon + text scale up at `sm:`, subtitle line hidden
 * below it) — the full two-line lockup at desktop size didn't fit next to
 * the mobile nav's hamburger button (~304px logo vs ~287px available on a
 * 375px phone), so this isn't optional per-usage, it's baked into the
 * component.
 *
 * `variant` adapts the colours to the surface it sits on:
 *  - "light" (default): brand-blue mark, dark text — for white/light headers
 *  - "dark": white mark + white/muted text — for the dark footer
 */
export function Logo({
  className = "",
  iconHeight = 44,
  variant = "light",
}: {
  className?: string;
  /** Intrinsic size passed to next/image for the aspect-ratio calc — the
   *  actual rendered height is responsive (h-8 sm:h-11), not this value. */
  iconHeight?: number;
  variant?: "light" | "dark";
}) {
  // Icon artwork aspect ratio is 1240 x 560 (≈2.214:1).
  const iconWidth = Math.round((iconHeight * 1240) / 560);
  const isDark = variant === "dark";

  const iconSrc = isDark ? "/brand/smart-icon-white.svg" : "/brand/smart-icon-only.svg";
  const primaryText = isDark ? "text-white" : "text-[var(--color-brand-blue)]";
  const secondaryText = isDark ? "text-[var(--text-muted)]" : "text-[var(--color-ink-muted)]";

  return (
    <Link
      href="/"
      className={`group flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}
      aria-label="Smart Technology Digital Information Hub — home"
    >
      <Image
        src={iconSrc}
        alt=""
        width={iconWidth}
        height={iconHeight}
        priority
        className="h-8 w-auto shrink-0 sm:h-11"
      />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`text-[13px] font-extrabold tracking-[0.02em] whitespace-nowrap sm:text-base sm:tracking-[0.04em] ${primaryText}`}
        >
          SMART TECHNOLOGY
        </span>
        {/* Heavy tracking on a caption line adds up fast — kept modest so this
            line never ends up wider than the headline above it (it did at
            0.24em, which was the actual cause of mobile overflow). Hidden
            below sm: at header widths the two-line lockup + hamburger button
            don't fit a phone screen otherwise. */}
        <span
          className={`mt-1 hidden text-[10px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase sm:block ${secondaryText}`}
        >
          Digital Information Hub
        </span>
      </span>
    </Link>
  );
}
