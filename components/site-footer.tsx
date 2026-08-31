import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { Brand } from "@/components/site-header";
import { AnalyticsPreferenceButton } from "@/components/site-analytics";
import { company, enquiryLinks } from "@/lib/company";
import { primaryService, supportingServices, specialistServices, serviceLabel, type ServiceLanguage } from "@/lib/services";

export function SiteFooter({ language }: { language: ServiceLanguage }) {
  const zh = language === "zh-CN";
  const enquiry = enquiryLinks();
  return <footer className="footer shared-footer"><div className="wrap footer-grid">
    <div className="footer-brand"><Brand /><p>{zh ? "主营中国发往全球海运订舱，优势航线为大洋洲、非洲和南美，并提供中国端采购、提货与仓储集运配套服务。" : "Global sea freight booking from China, focused on Oceania, Africa and South America, with procurement, pickup and warehouse consolidation support."}</p><div><a href={company.tiktok} target="_blank" rel="noreferrer">TikTok @vinson300</a><a href={company.instagram} target="_blank" rel="noreferrer">Instagram @vinson08251</a></div></div>
    <div className="footer-services"><h3>{zh ? "主营推荐" : "Our main service"}</h3><a className="footer-primary-service" href={`/services/${primaryService.slug}`}>{serviceLabel(primaryService, language)}</a><p className="footer-trade-lanes">{zh ? "优势航线：大洋洲 · 非洲 · 南美" : "Focus trade lanes: Oceania · Africa · South America"}</p><h4 className="footer-support-title">{zh ? "配套服务" : "Supporting services"}</h4>{supportingServices.map(service => <a href={`/services/${service.slug}`} key={service.slug}>{serviceLabel(service, language)}</a>)}</div>
    <div><h3>{zh ? "更多服务与资讯" : "More from TengYoda"}</h3>{specialistServices.map(service => <a href={`/services/${service.slug}`} key={service.slug}>{serviceLabel(service, language)}</a>)}<a href="/services">{zh ? "全部服务" : "All services"}</a><a href="/blog">{zh ? "物流博客" : "Logistics blog"}</a><a href="/#network">{zh ? "仓库与办公室" : "Warehouses & offices"}</a></div>
    <div className="footer-contact"><h3>{zh ? "直接联系 Vinson" : "Talk to Vinson"}</h3><a href={enquiry.whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />{company.phone}</a><a href={enquiry.email}><Mail aria-hidden="true" />{company.email}</a><a href={`mailto:${company.alternateEmail}`}>{company.alternateEmail}</a><a href={company.telephone}>{zh ? "电话联系" : "Call"}: {company.phone}</a><a href="/#network">{zh ? "佛山 · 深圳 · 青岛 · 义乌" : "Foshan · Shenzhen · Qingdao · Yiwu"}</a></div>
  </div><div className="wrap footer-bottom"><span>© 2026 TengYoda Logistics.</span><AnalyticsPreferenceButton language={language} /><a href="#top">{zh ? "返回顶部" : "Back to top"}<ArrowUp aria-hidden="true" /></a></div></footer>;
}
