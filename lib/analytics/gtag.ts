"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * The conversion events named in the build spec. Keeping this as a closed
 * union (rather than a free string) means a typo here is a compile error,
 * not a silently-missing conversion in GA4.
 */
export type ConversionEvent =
  | "contact_form_submit"
  | "product_enquiry"
  | "training_application"
  | "internship_application"
  | "career_application"
  | "general_application"
  | "quote_request";

export function trackEvent(event: ConversionEvent | string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
