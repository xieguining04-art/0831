"use client";

import { useEffect, useState } from "react";
import { Clock3, Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Language } from "@/lib/localization";
import { worldClocks } from "@/lib/world-clocks";
import { company } from "@/lib/company";

export function useSiteLanguage() {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    try { if (window.localStorage.getItem("tengyoda.language") === "zh-CN") setLanguage("zh-CN"); } catch { /* The preference is optional. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function changeLanguage(value: Language) {
    setLanguage(value);
    try { window.localStorage.setItem("tengyoda.language", value); } catch { /* Keep the switch usable without storage. */ }
  }
  return { language, changeLanguage };
}

export function WorldClockBar({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <div className="world-clock-bar"><div className="wrap world-clock-inner"><div className="clock-scroll" tabIndex={0} role="region" aria-label={language === "zh-CN" ? "世界时钟，左右滑动查看" : "World clocks; scroll horizontally for more"}>{worldClocks.map(({ city, zone, english, formatter }) => <span className="clock-item" key={zone} title={zone}><Clock3 aria-hidden="true" /><b>{language === "zh-CN" ? city : english}</b><time dateTime={now?.toISOString()}>{now ? formatter.format(now) : "--:--"}</time></span>)}</div><Select value={language} onValueChange={(value) => onLanguageChange(value === "zh-CN" ? "zh-CN" : "en")}><SelectTrigger className="language-trigger" aria-label={language === "zh-CN" ? "切换语言" : "Choose language"}><Languages className="language-icon" aria-hidden="true" /><SelectValue /></SelectTrigger><SelectContent position="popper" align="end"><SelectItem value="zh-CN">简体中文</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select><a className="clock-call" href={company.telephone}>{language === "zh-CN" ? "致电 " : "Call us "}<b>+86 186 2024 4613</b></a></div></div>;
}
