// Analytics configuration — no-ops gracefully if IDs are absent
// TODO: Set NEXT_PUBLIC_GA4_ID or NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env.local

export const analyticsConfig = {
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_ID ?? null,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? null,
};

// Custom event names
export const EVENTS = {
  AFFILIATE_CLICK: "affiliate_click",
  GUMROAD_CLICK: "gumroad_click",
  EMAIL_SUBSCRIBE: "email_subscribe",
  COMPARE_ADD: "compare_add",
  SEARCH_QUERY: "search_query",
} as const;

type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/** Fire a custom analytics event — no-ops if analytics not configured */
export function trackEvent(
  name: EventName,
  props?: Record<string, string | number>
) {
  if (typeof window === "undefined") return;

  // GA4
  if (analyticsConfig.ga4MeasurementId && (window as any).gtag) {
    (window as any).gtag("event", name, props ?? {});
  }

  // Plausible
  if (analyticsConfig.plausibleDomain && (window as any).plausible) {
    (window as any).plausible(name, { props: props ?? {} });
  }
}
