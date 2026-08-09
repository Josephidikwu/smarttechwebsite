import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { SocialIcon } from "@/components/ui/social-icons";
import { contact, socials } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a project, technology requirement, procurement request or question? Tell Smart Technology what you need and let's explore how we can help.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk Technology."
        intro="Have a project, technology requirement, procurement request or question? Tell us what you need and let's explore how we can help."
        image="/images/heroes/contact.jpg"
        imageAlt="Get in touch with Smart Technology"
      />

      <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Get in touch
          </h2>

          <dl className="mt-8 space-y-6 text-sm">
            <div>
              <dt className="font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
                Visit us
              </dt>
              <dd className="mt-2 not-italic text-[var(--color-ink-muted)]">
                {contact.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>

            <div>
              <dt className="font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[var(--color-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--color-brand-blue)] hover:underline"
                >
                  {contact.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
                Call us
              </dt>
              <dd className="mt-2 space-y-1">
                {contact.phones.map((phone) => (
                  <a
                    key={phone.tel}
                    href={`tel:${phone.tel}`}
                    className="block text-[var(--color-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--color-brand-blue)] hover:underline"
                  >
                    {phone.display}
                  </a>
                ))}
              </dd>
            </div>

            <div>
              <dt className="font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
                Follow us
              </dt>
              <dd className="mt-3 flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
                  >
                    <SocialIcon icon={social.icon} className="h-4 w-4" />
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </Container>
    </>
  );
}
