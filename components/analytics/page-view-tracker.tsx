"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * GA4's default snippet only sees the first page load — Next.js App Router
 * client-side navigations don't trigger a fresh script evaluation. This
 * fires an explicit page_view on every route change (config'd with
 * send_page_view: false in GA4Script to avoid double-counting the first
 * load).
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    const url = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    window.gtag("event", "page_view", { page_path: url });
  }, [pathname, searchParams]);

  return null;
}
