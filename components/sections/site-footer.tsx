import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { NewsletterForm } from "@/components/sections/newsletter-form";
import { footerColumns, site } from "@/lib/brand";

export function SiteFooter() {
  // Extract legal links separately to place them in the copyright row
  const legalColumn = footerColumns.find((col) => col.heading === "Legal");
  const mainColumns = footerColumns.filter((col) => col.heading !== "Legal");

  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b] text-[var(--text)]">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo iconHeight={44} variant="dark" />
            <p className="mt-5 text-sm font-medium text-white">{site.tagline}</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--text-muted)]">
              Technology Products &middot; Procurement &middot; Software &middot; AI &middot; Data
              &middot; IT Infrastructure &middot; Digital Solutions
            </p>

            <NewsletterForm />
          </div>

          {mainColumns.map((column) => (
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

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          {legalColumn && (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {legalColumn.links.map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[var(--text-muted)] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </footer>
  );
}
