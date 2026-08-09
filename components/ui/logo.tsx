import Image from "next/image";
import Link from "next/link";

/**
 * Icon mark (from the brand guide's logo, public/brand/smart-icon.svg) set
 * next to our own typeset wordmark rather than the full raster/vector
 * lockup — keeps the header crisp at small sizes while the icon itself
 * stays exactly as supplied. See docs/design-direction.md.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Smart Technology — home">
      <Image src="/brand/smart-icon.svg" alt="" width={36} height={36} priority />
      <span className="text-lg leading-none font-bold tracking-tight text-white">
        Smart<span className="text-[var(--accent-hover)]">Technology</span>
      </span>
    </Link>
  );
}
