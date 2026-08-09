import Image from "next/image";
import { Container } from "@/components/ui/container";

/**
 * Clean image-led hero band for inner pages — a full-width photograph with a
 * dark gradient overlay for legibility and the eyebrow + heading (+ optional
 * intro) set in white on top. Keeps inner pages consistent with the image-led
 * homepage while staying restrained and readable.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  priority = true,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
  priority?: boolean;
}) {
  return (
    <section className="relative isolate flex min-h-[320px] items-end overflow-hidden bg-[#0b0b0b] lg:min-h-[420px]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-black/20" />

      <Container className="relative z-10 pb-10 pt-24 lg:pb-14 lg:pt-32">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">{intro}</p>}
      </Container>
    </section>
  );
}
