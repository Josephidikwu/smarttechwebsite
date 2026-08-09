import Image from "next/image";
import Link from "next/link";

/**
 * Brand lockup: the circuit-chip mark (icon-only crop of the supplied logo)
 * set beside a two-line typeset wordmark — "SMART TECHNOLOGY" over
 * "DIGITAL INFORMATION HUB" in tracked caps, mirroring the real logo.
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
      className={`group flex items-center gap-3 ${className}`}
      aria-label="Smart Technology Digital Information Hub — home"
    >
      <Image
        src={iconSrc}
        alt=""
        width={iconWidth}
        height={iconHeight}
        priority
        className="w-auto shrink-0"
        style={{ height: iconHeight }}
      />
      <span className="flex flex-col leading-none">
        <span className={`text-base font-extrabold tracking-[0.04em] ${primaryText}`}>
          SMART TECHNOLOGY
        </span>
        <span className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] ${secondaryText}`}>
          Digital Information Hub
        </span>
      </span>
    </Link>
  );
}
