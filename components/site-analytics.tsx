"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  GA4_MEASUREMENT_ID, CONSENT_STORAGE_KEY, PREFERENCES_EVENT,
  analyticsPage, contactPlacement, createAnalyticsClient,
  readAnalyticsConsent, serializeAnalyticsConsent,
} from "@/lib/analytics";

type TagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

function browserClient() {
  const target = window as TagWindow;
  return createAnalyticsClient({
    command(...args) {
      target.dataLayer ??= [];
      // Google's command queue expects Arguments objects, not ordinary arrays.
      // eslint-disable-next-line prefer-rest-params
      target.gtag ??= function () { target.dataLayer!.push(arguments); };
      target.gtag(...args);
    },
    load(id) {
      if (document.getElementById("tengyoda-ga4")) return;
      const script = document.createElement("script");
      script.id = "tengyoda-ga4";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);
    },
    disable(disabled) {
      (target as unknown as Record<string, unknown>)[`ga-disable-${GA4_MEASUREMENT_ID}`] = disabled;
    },
  });
}

export function AnalyticsPreferenceButton({ language }: { language: "en" | "zh-CN" }) {
  return <Button type="button" variant="link" className="analytics-preferences" onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}>
    {language === "zh-CN" ? "统计偏好" : "Analytics preferences"}
  </Button>;
}

export function SiteAnalytics() {
  const pathname = usePathname();
  const client = useRef<ReturnType<typeof browserClient> | null>(null);
  const consent = useRef(false);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [selection, setSelection] = useState<boolean | null>(null);

  useEffect(() => {
    client.current ??= browserClient();
    const page = () => analyticsPage(window.location.href, document.referrer);
    const applyChoice = (choice: boolean | null) => {
      consent.current = choice === true;
      setSelection(choice);
      client.current!.setConsent(choice === true, page());
      if (choice) client.current!.pageView(page());
    };
    let saved: boolean | null = null;
    try { saved = readAnalyticsConsent(localStorage.getItem(CONSENT_STORAGE_KEY)); } catch { /* Choice still works in this tab. */ }
    applyChoice(saved);
    // Consent is browser-only; initialize after hydration to preserve SSR markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(saved === null);

    const updateLanguage = () => setLanguage(document.documentElement.lang === "zh-CN" ? "zh-CN" : "en");
    updateLanguage();
    const observer = new MutationObserver(updateLanguage);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    const showPreferences = () => setOpen(true);
    const syncChoice = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
      const next = readAnalyticsConsent(event.newValue);
      applyChoice(next);
      setOpen(next === null);
    };
    const trackContact = (event: MouseEvent) => {
      if (!consent.current || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor) return;
      const currentPage = page();
      client.current!.contact(anchor.getAttribute("href") || "", contactPlacement(anchor, currentPage?.page_path || "/"), currentPage, document.documentElement.lang);
    };
    window.addEventListener(PREFERENCES_EVENT, showPreferences);
    window.addEventListener("storage", syncChoice);
    document.addEventListener("click", trackContact, true);
    return () => {
      observer.disconnect();
      window.removeEventListener(PREFERENCES_EVENT, showPreferences);
      window.removeEventListener("storage", syncChoice);
      document.removeEventListener("click", trackContact, true);
    };
  }, []);

  useEffect(() => {
    const page = analyticsPage(window.location.href, document.referrer);
    client.current?.setConsent(consent.current, page);
    if (consent.current) client.current?.pageView(page);
  }, [pathname]);

  const choose = (allowed: boolean) => {
    consent.current = allowed;
    setSelection(allowed);
    try { localStorage.setItem(CONSENT_STORAGE_KEY, serializeAnalyticsConsent(allowed)); } catch { /* Choice still works in this tab. */ }
    const page = analyticsPage(window.location.href, document.referrer);
    client.current?.setConsent(allowed, page);
    if (allowed) client.current?.pageView(page);
    setOpen(false);
  };

  if (!open) return null;
  const zh = language === "zh-CN";
  return <section className="analytics-notice" role="region" aria-labelledby="analytics-title" aria-describedby="analytics-description">
    <span className="analytics-eyebrow">TENGYODA</span>
    <h2 id="analytics-title">{zh ? "由您决定是否开启统计" : "Your choice on analytics"}</h2>
    <p id="analytics-description">{zh
      ? "同意后，我们才会加载 Google Analytics 并使用统计 Cookie，了解页面浏览和 WhatsApp、邮件、电话入口的点击。自定义点击事件不包含咨询正文，也不表示已收到询盘。"
      : "Only with your permission will we load Google Analytics and use analytics cookies to measure page views and WhatsApp, email and phone link clicks. Our custom click events exclude message content and do not confirm an enquiry was received."}</p>
    <p className="analytics-detail">{zh
      ? "拒绝不影响浏览或联系。选择在此浏览器保存 180 天，您可随时通过页脚“统计偏好”更改。"
      : "Declining does not affect browsing or contacting us. Your choice is saved in this browser for 180 days. Change it anytime using Analytics preferences in the footer."}</p>
    {selection !== null && <p className="analytics-current">{zh ? `当前：${selection ? "已允许统计" : "已拒绝统计"}` : `Current choice: analytics ${selection ? "allowed" : "declined"}`}</p>}
    <div className="analytics-choices">
      <Button type="button" variant="outline" onClick={() => choose(false)}>{zh ? "拒绝统计" : "Decline analytics"}</Button>
      <Button type="button" variant="outline" onClick={() => choose(true)}>{zh ? "允许统计" : "Allow analytics"}</Button>
    </div>
  </section>;
}
