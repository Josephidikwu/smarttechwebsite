"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type ConversionEvent } from "@/lib/analytics/gtag";

/**
 * Drop into a success/thank-you page to fire its conversion event once on
 * mount. A page load there is the definitive signal of a completed
 * submission — simpler and more reliable than instrumenting every form.
 */
export function ConversionTracker({
  event,
  params,
}: {
  event: ConversionEvent;
  params?: Record<string, unknown>;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per mount, not on param identity changes
  }, [event]);

  return null;
}
