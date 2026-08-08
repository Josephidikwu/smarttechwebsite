"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";
import { logout } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/auth/session";

export function AdminSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-5 py-5">
        <Image src="/brand/smart-icon.svg" alt="" width={26} height={26} />
        <span className="text-sm font-bold tracking-tight text-[var(--color-ink)]">
          Smart<span className="text-[var(--color-brand-blue)]">Technology</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {adminNav.map((group) => (
          <div key={group.heading || "root"} className="mb-5">
            {group.heading && (
              <p className="px-2.5 pb-1.5 text-xs font-semibold tracking-wide text-[var(--color-ink-muted)] uppercase">
                {group.heading}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                if (!item.available) {
                  return (
                    <li key={item.href}>
                      <span className="flex cursor-not-allowed items-center justify-between rounded-md px-2.5 py-2 text-sm text-[var(--color-ink-muted)]/50">
                        {item.label}
                        <span className="text-[10px] tracking-wide uppercase">Soon</span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-2.5 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[var(--color-brand-blue-tint)] text-[var(--color-brand-blue)]"
                          : "text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] px-5 py-4">
        <p className="truncate text-sm font-medium text-[var(--color-ink)]">{user.name}</p>
        <p className="truncate text-xs text-[var(--color-ink-muted)]">{user.email}</p>
        <form action={logout} className="mt-3">
          <button
            type="submit"
            className="text-xs font-medium text-[var(--color-brand-blue)] hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
