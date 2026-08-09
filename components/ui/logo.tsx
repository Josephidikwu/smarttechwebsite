import Image from "next/image";
import Link from "next/link";

/**
 * Brand lockup: the circuit-chip mark (icon-only crop of the supplied logo,
 * recoloured white for dark surfaces — public/brand/smart-icon-white.svg) set
 * beside a typeset wordmark that mirrors the real logo hierarchy — bold
 * "SMART" over the "TECHNOLOGY DIGITAL INFORMATION HUB" tagline in tracked
 * small caps. Sized generously so it reads clearly in the header/footer.
 */
export function Logo({
  className = "",
  iconHeight = 40,
}: {
  className?: string;
  iconHeight?: number;
}) {
  // Icon artwork aspect ratio is 1240 x 560 (≈2.214:1).
  const iconWidth = Math.round((iconHeight * 1240) / 560);

  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 ${className}`}
      aria-label="Smart Technology Digital Information Hub — home"
    >
      <Image
        src="/brand/smart-icon-white.svg"
        alt=""
        width={iconWidth}
        height={iconHeight}
        priority
        className="w-auto shrink-0"
        style={{ height: iconHeight }}
      />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-[0.02em] text-white">SMART</span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          Technology Digital Information Hub
        </span>
      </span>
    </Link>
  );
}
