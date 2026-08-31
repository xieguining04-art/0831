"use client";

import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryActions } from "@/components/enquiry-actions";
import { Reveal } from "@/components/motion";
import { useSiteLanguage } from "@/components/world-clock-bar";
import { orderedServices as services, relatedServices, serviceLabel, type Service } from "@/lib/services";
import { enquiryLinks } from "@/lib/company";
import { serviceSeo } from "@/lib/seo";
import { ServiceSearchDetails } from "@/components/service-search-details";

export function ServiceView({ service }: { service?: Service }) {
  const { language, changeLanguage } = useSiteLanguage();
  const zh = language === "zh-CN";
  const content = service?.content[language];
  const searchCopy = service ? serviceSeo[service.slug]?.content[language] : undefined;
  const topic = service ? serviceLabel(service, "en") : undefined;
  const quoteUrl = enquiryLinks(topic).whatsapp;
  const related = service ? relatedServices(service.slug) : [];
  return <div className="site blog-site" id="top"><SiteHeader language={language} onLanguageChange={changeLanguage} active="services" /><main id="main-content" tabIndex={-1}>
    <section className="blog-hero service-hero editorial-hero page-enter"><img className="editorial-photo" src={service?.image ?? "/images/sea-freight.webp"} alt={service?.alt[language] ?? (zh ? "国际港口内的集装箱船" : "Container vessel at an international seaport")} width={1672} height={941} fetchPriority="high" /><div className="editorial-shade" /><div className="wrap"><nav className="blog-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}><a href="/">{zh ? "首页" : "Home"}</a><span>/</span>{service ? <><a href="/services">{zh ? "我们的服务" : "Our services"}</a><span>/</span><span>{content?.title}</span></> : <span>{zh ? "我们的服务" : "Our services"}</span>}</nav><span className="kicker light"><i />{zh ? "从中国连接全球" : "CHINA ORIGIN. GLOBAL REACH."}</span><h1>{searchCopy?.h1 ?? (zh ? "全球海运订舱与中国端配套服务。" : "Global sea freight booking, with China-side support.")}</h1><p>{content?.summary ?? (zh ? "主营全球海运订舱，优势航线为大洋洲、非洲和南美；空运、快递、采购、集运和中国境内陆运提供配套支持。" : "Global sea freight is our main service, focused on Oceania, Africa and South America. Air freight, express, procurement, consolidation and China road transport provide supporting options.")}</p><a className="button accent service-hero-button" href={service ? "#service-details" : "#service-directory"}>{zh ? "探索服务" : "Explore the service"}<ArrowRight /></a></div></section>
    {!service && <section className="service-directory section" id="service-directory"><div className="wrap service-directory-grid">{services.map((item, index) => <Reveal key={item.slug} delay={(index % 3) * 70}><article className="directory-card media-hover-card"><a className="insight-visual" href={`/services/${item.slug}`} aria-label={serviceLabel(item, language)}><img src={item.image} alt={item.alt[language]} width={1672} height={941} loading="lazy" /><span>0{index + 1}</span></a><div><h2><a href={`/services/${item.slug}`}>{serviceLabel(item, language)}</a></h2><p>{item.content[language].summary}</p><a className="text-link" href={`/services/${item.slug}`}>{zh ? "了解更多" : "Learn more"}<ArrowRight /></a></div></article></Reveal>)}</div></section>}
    {service && content && <>
      <section className="section service-detail-section" id="service-details"><div className="wrap service-detail-grid"><aside className="service-sidebar"><nav aria-label={zh ? "服务导航" : "Service navigation"}><h2>{zh ? "我们的服务" : "Our services"}</h2>{services.map(item => <a href={`/services/${item.slug}`} key={item.slug} aria-current={item.slug === service.slug ? "page" : undefined}>{serviceLabel(item, language)}<ArrowRight /></a>)}</nav><a className="text-link" href="/services">{zh ? "全部服务" : "All services"}<ArrowRight /></a></aside><div className="service-body"><Reveal><span className="kicker"><i />{zh ? "服务概览" : "SERVICE OVERVIEW"}</span><h2>{zh ? "让每个环节清晰衔接。" : "Bring every step together."}</h2><p className="service-lead">{searchCopy?.intro ?? content.detail}</p></Reveal><Reveal><div className="scope-grid">{content.scope.map((item, index) => <div key={item}><span>0{index + 1}</span><Check aria-hidden="true" /><h3>{item}</h3></div>)}</div></Reveal><Reveal><figure className="service-detail-image"><img src={service.image} alt={service.alt[language]} width={1672} height={941} loading="lazy" /></figure></Reveal><Reveal><section className="shipment-checklist"><span className="kicker"><i />{zh ? "询价前准备" : "BEFORE YOU ENQUIRE"}</span><h2>{zh ? "请准备这些货物资料。" : "Start with the right cargo details."}</h2><ul>{content.preparation.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><p>{zh ? "实际承运、时效及费用以具体货物、路线和确认方案为准。" : "Cargo acceptance, timing and charges are subject to the shipment, route and confirmed scope."}</p></section></Reveal><Reveal><ServiceSearchDetails slug={service.slug} language={language} /></Reveal></div></div></section>
      {related.length > 0 && <section className="blog-related"><div className="wrap"><div className="blog-index-heading"><h2>{zh ? "相关服务" : "Connected services"}</h2><a className="text-link" href="/services">{zh ? "查看全部" : "View all"}<ArrowRight /></a></div><div className="related-service-links">{related.map(item => <a href={`/services/${item.slug}`} key={item.slug}>{serviceLabel(item, language)}<ArrowRight /></a>)}</div></div></section>}
    </>}
    <section className="blog-cta"><div className="wrap"><div><span className="kicker light"><i />{zh ? "与 VINSON 直接沟通" : "A DIRECT CONVERSATION WITH VINSON"}</span><h2>{zh ? "聊聊您的下一票货物。" : "Let's plan your next shipment."}</h2><p>{zh ? "把货物资料与目的地发给我们，开始中国端运输规划。" : "Share your cargo details and destination to start planning the China-side steps."}</p></div><EnquiryActions language={language} topic={topic} /></div></section>
  </main><SiteFooter language={language} /><a className="float-wa" href={quoteUrl} target="_blank" rel="noreferrer" aria-label={zh ? "通过 WhatsApp 联系 Vinson" : "Contact Vinson on WhatsApp"}><MessageCircle /></a></div>;
}
