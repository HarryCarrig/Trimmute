export const ANALYTICS_OPT_OUT_KEY = "trimmute_analytics_opt_out";

export function isAnalyticsOptedOut(): boolean {
  if (typeof window === "undefined") return false;

  return localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "true";
}

export function setAnalyticsOptOut(optOut: boolean) {
  localStorage.setItem(
    ANALYTICS_OPT_OUT_KEY,
    optOut ? "true" : "false"
  );
}