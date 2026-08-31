import { company } from "./company";

export const GA4_MEASUREMENT_ID = "G-G1G4DZNQ9P";
export const CONSENT_STORAGE_KEY = "tengyoda.analytics-consent.v1";
export const PREFERENCES_EVENT = "tengyoda:analytics-preferences";
const consentLifetime = 180 * 24 * 60 * 60 * 1000;

// Only public content routes are measured. Never send search strings, fragments,
// arbitrary URL paths, contact URLs, message text or visitor-entered values.
export const measuredPaths = new Set([
  "/", "/services", "/blog",
  "/services/freight-forwarding", "/services/china-import-export",
  "/services/air-freight", "/services/oversize-freight", "/services/sea-freight",
  "/services/transport-warehousing", "/services/roro-project-cargo",
  "/services/cargo-consolidation", "/services/international-express",
  "/blog/buying-from-china-checklist", "/blog/express-air-lcl-fcl-guide",
  "/blog/avoid-destination-shipping-charges",
]);

export type PageContext = { page_path: string; page_location: string; page_referrer: string; site_environment: "preview" | "production" };
export type ContactMethod = "whatsapp" | "email" | "phone";
export type ContactPlacement = "header" | "mega_menu" | "mobile_menu" | "floating_button" | "footer" | "contact_section" | "service_cta" | "blog_cta" | "content";
export type AnalyticsTransport = {
  command: (...args: unknown[]) => void;
  load: (measurementId: string) => void;
  disable: (disabled: boolean) => void;
};

export function analyticsPage(url: string, referrer = ""): PageContext | null {
  try {
    const location = new URL(url);
    const path = location.pathname.replace(/\/+$/, "") || "/";
    if (location.protocol !== "https:" || !measuredPaths.has(path)) return null;
    const environment = location.hostname === "tengyoda-premium-preview.xieguining04.chatgpt.site" ? "preview"
      : ["tengyodalogistics.com", "www.tengyodalogistics.com"].includes(location.hostname) ? "production" : null;
    if (!environment) return null;
    let safeReferrer = "";
    try {
      const previous = new URL(referrer);
      if (previous.protocol === "https:" || previous.protocol === "http:") safeReferrer = previous.origin;
    } catch { /* Empty or invalid referrers are omitted. */ }
    return { page_path: path, page_location: `${location.origin}${path}`, page_referrer: safeReferrer, site_environment: environment };
  } catch { return null; }
}

export function contactMethod(href: string): ContactMethod | null {
  try {
    const url = new URL(href);
    if (url.protocol === "https:" && url.origin === "https://wa.me" && url.pathname === new URL(company.whatsapp).pathname) return "whatsapp";
    if (url.protocol === "mailto:" && [company.email, company.alternateEmail].includes(decodeURIComponent(url.pathname).toLowerCase())) return "email";
    if (url.protocol === "tel:" && decodeURIComponent(url.pathname).replace(/[\s()-]/g, "") === company.telephone.slice(4)) return "phone";
  } catch { /* Malformed links are not contact events. */ }
  return null;
}

export function contactPlacement(anchor: Pick<Element, "closest">, path: string): ContactPlacement {
  if (anchor.closest(".float-wa")) return "floating_button";
  if (anchor.closest(".mobile-sheet")) return "mobile_menu";
  if (anchor.closest(".mega-cta")) return "mega_menu";
  if (anchor.closest(".main-header, .world-clock-bar")) return "header";
  if (anchor.closest(".shared-footer")) return "footer";
  if (anchor.closest("#contact")) return "contact_section";
  if (anchor.closest(".blog-cta")) return path.startsWith("/services") ? "service_cta" : "blog_cta";
  return "content";
}

export function readAnalyticsConsent(raw: string | null, now = Date.now()): boolean | null {
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw);
    if (stored.version !== 1 || typeof stored.analytics !== "boolean" || typeof stored.updatedAt !== "number"
      || stored.updatedAt > now || now - stored.updatedAt >= consentLifetime) return null;
    return stored.analytics;
  } catch { return null; }
}

export function serializeAnalyticsConsent(analytics: boolean, now = Date.now()) {
  return JSON.stringify({ version: 1, analytics, updatedAt: now });
}

const denied = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

/** No transport calls before consent; no lead/success events exist in this client. */
export function createAnalyticsClient(transport: AnalyticsTransport) {
  let allowed = false;
  let initialized = false;
  let lastPage = "";
  const command = (...args: unknown[]) => { try { transport.command(...args); } catch { /* Analytics must never break the site. */ } };

  return {
    setConsent(granted: boolean, page: PageContext | null) {
      allowed = granted && page !== null;
      if (!allowed) {
        if (initialized) {
          try { transport.disable(true); } catch { /* Best effort. */ }
          command("consent", "update", denied);
        }
        return;
      }
      try { transport.disable(false); } catch { /* Best effort. */ }
      if (initialized) {
        command("consent", "update", { ...denied, analytics_storage: "granted" });
        return;
      }
      initialized = true;
      command("consent", "default", denied);
      command("js", new Date());
      command("consent", "update", { ...denied, analytics_storage: "granted" });
      command("config", GA4_MEASUREMENT_ID, {
        ...page, send_page_view: false, allow_google_signals: false,
        allow_ad_personalization_signals: false, cookie_expires: 60 * 60 * 24 * 180,
      });
      try { transport.load(GA4_MEASUREMENT_ID); } catch { /* Blocked scripts do not block contact links. */ }
    },
    pageView(page: PageContext | null) {
      if (!allowed || !page || page.page_location === lastPage) return false;
      lastPage = page.page_location;
      command("config", GA4_MEASUREMENT_ID, { ...page, update: true, send_page_view: false });
      command("event", "page_view", { ...page, send_to: GA4_MEASUREMENT_ID });
      return true;
    },
    contact(href: string, placement: ContactPlacement, page: PageContext | null, language: string) {
      const method = contactMethod(href);
      if (!allowed || !page || !method) return false;
      command("event", "contact_click", {
        ...page, contact_method: method, contact_placement: placement,
        ui_language: language === "zh-CN" ? "zh-CN" : "en",
        enquiry_status: "not_confirmed", send_to: GA4_MEASUREMENT_ID,
      });
      return true;
    },
  };
}
