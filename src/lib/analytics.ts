/**
 * Conversion events, kept to the shortlist in the brief:
 * CTA clicks, phone taps, form starts, form success, outbound map/social clicks.
 *
 * No analytics provider ships with this site and nothing here sets a cookie or
 * sends personal data. `track` hands the event to a provider only if the owner
 * has installed one (Vercel Analytics' `window.va`, or a `dataLayer` for a
 * consent-managed tag manager). With no provider installed it is a no-op, so
 * the site collects nothing until that is a decision someone made on purpose.
 *
 * See README.md → Analytics for how to switch one on.
 */

export type AnalyticsEvent =
  | "cta_click"
  | "phone_tap"
  | "form_start"
  | "form_success"
  | "outbound_map"
  | "outbound_social";

/** Non-identifying context only: which surface the event came from. */
export type EventProps = { location: string };

declare global {
  interface Window {
    va?: (event: "event", payload: Record<string, unknown>) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, props: EventProps) {
  if (typeof window === "undefined") return;

  try {
    window.va?.("event", { name: event, data: props });
    window.dataLayer?.push({ event, ...props });
  } catch {
    // Analytics must never break an action the visitor is trying to take.
  }
}
