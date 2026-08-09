import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/sections/newsletter-form";
import { footerColumns, site } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b] text-[var(--text)]">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <Image src="/brand/smart-icon.svg" alt="" width={32} height={32} />
              <span className="text-base font-bold tracking-tight text-white">
                Smart<span className="text-[var(--accent-hover)]">Technology</span>
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-white">{site.tagline}</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--text-muted)]">
              Technology Products &middot; Procurement &middot; Software &middot; AI &middot; Data
              &middot; IT Infrastructure &middot; Digital Solutions
            </p>

            <NewsletterForm />
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold text-white">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
