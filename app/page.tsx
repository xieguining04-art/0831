"use client";

import {
  ArrowRight, Check, MessageCircle, PackageCheck, SearchCheck,
} from "lucide-react";

import { localizePage } from "@/lib/localization";
import { useSiteLanguage } from "@/components/world-clock-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CompanyNetwork } from "@/components/company-network";
import { EnquiryActions } from "@/components/enquiry-actions";
import { HeroCarousel } from "@/components/hero-carousel";
import { Reveal } from "@/components/motion";
import { blogPosts } from "@/lib/blog-posts";
import { homepageServices, serviceLabel } from "@/lib/services";
import { enquiryLinks } from "@/lib/company";

export default function Home() {
  const { language, changeLanguage } = useSiteLanguage();
  const enquiry = enquiryLinks();
  return localizePage((
    <div className="site" id="top">
      <SiteHeader language={language} onLanguageChange={changeLanguage} />
      <main id="main-content" tabIndex={-1}>
      <HeroCarousel language={language} />

      <section className="intro section" id="about">
        <div className="wrap intro-grid">
          <figure className="intro-visual"><img src="/images/sea-freight.webp" alt={language === "en" ? "Container vessel and cranes at an international seaport" : "国际海港内的集装箱船与岸吊"} width={1672} height={941} loading="lazy" /><figcaption>{language === "en" ? "CHINA PORTS. GLOBAL SEA FREIGHT." : "中国港口出发，海运连接全球。"}</figcaption></figure>
          <div className="intro-copy"><span className="kicker"><i /> TENGYODA GLOBAL LOGISTICS</span><h2>{language === "en" ? "Global sea freight booking is our main business." : "主营全球海运订舱。"}</h2><p>{language === "en" ? "Based in Foshan, TengYoda is a China freight forwarder specialising in global sea freight booking. We coordinate full-container-load (FCL), less-than-container-load (LCL) and special-equipment enquiries from Chinese ports through one direct contact." : "TengYoda 立足佛山，以中国发往全球海运订舱为主营业务，提供整柜（FCL）、拼箱（LCL）及特种箱订舱咨询，由专人对接中国港口出运安排。"}</p><p>{language === "en" ? "Our focus trade lanes are Oceania, Africa and South America. China procurement, factory pickup and our Qingdao, Yiwu and Shenzhen warehouses support cargo collection and consolidation before shipping. Air freight and express remain available for time-sensitive orders." : "海运优势航线为大洋洲、非洲和南美。中国境内采购、工厂提货及青岛、义乌、深圳仓库集运作为出运配套服务；有时效要求的货物也可咨询空运与国际快递。"}</p><a className="text-link" href="/services/sea-freight">{language === "en" ? "Explore global sea freight booking" : "了解全球海运订舱"}<ArrowRight /></a></div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="wrap">
          <div className="section-head"><div><span className="kicker"><i /> FROM CHINA TO THE WORLD</span><h2>{language === "en" ? "Sea freight, backed by China-side support." : "海运订舱为主，配套服务衔接。"}</h2></div><div className="section-head-side"><p>{language === "en" ? "Global sea freight is our main service, with a focus on Oceania, Africa and South America. Supporting services connect your suppliers to departure." : "主营全球海运订舱，优势航线为大洋洲、非洲和南美；配套服务衔接供应商到出口发运。"}</p><a className="text-link" href="/services">{language === "en" ? "View all services" : "查看全部服务"}<ArrowRight /></a></div></div>
          <div className="service-grid core-service-grid">
            {homepageServices.map((service, index) => <Reveal key={service.slug} delay={(index % 3) * 60}><article className="service-card service-photo-card media-hover-card"><a className="service-cover" href={`/services/${service.slug}`} aria-label={serviceLabel(service, language)}><img src={service.image} alt={service.alt[language]} width={1672} height={941} loading="lazy" /><span>0{index + 1}</span></a><div className="service-card-copy"><h3><a href={`/services/${service.slug}`}>{serviceLabel(service, language)}</a></h3><p>{service.content[language].summary}</p><a href={`/services/${service.slug}`}>Learn more <ArrowRight /></a></div></article></Reveal>)}
          </div>
          <a className="all-services" href="/services">{language === "en" ? "Explore all logistics services" : "查看全部物流服务"} <ArrowRight /></a>
        </div>
      </section>

      <section className="specialists" id="specialists">
        <div className="specialist-image"><img src="/images/project-cargo.webp" alt={language === "en" ? "Heavy machinery secured for specialist port transport" : "为港口运输固定的大型机械"} width={1672} height={941} loading="lazy" /></div>
        <div className="specialist-copy"><span className="kicker light"><i /> SPECIAL CARGO</span><h2>Specialised coordination for special situations.</h2><p>Unusual freight needs more than a standard rate. We review the dimensions, weight, lifting points, packaging, equipment, route restrictions and destination requirements before the cargo moves.</p><ul><li><Check /> Oversize and heavy cargo planning</li><li><Check /> RoRo vehicles and mobile equipment</li><li><Check /> Breakbulk and special project shipments</li><li><Check /> Destination customs coordination through local partners</li></ul><a className="button outline-light" href="#contact">Talk through your cargo <ArrowRight /></a></div>
      </section>

      <section className="standards section">
        <div className="wrap standards-grid">
          <div className="standards-intro"><span className="kicker"><i /> OUR WORKING STANDARD</span><h2>Prepared carefully. Communicated clearly.</h2><p>We focus on the details that prevent avoidable cost: accurate cargo information, suitable packing, realistic lead times, clear quotation scope and coordinated handoffs.</p><a className="text-link" href="#contact">Start with a shipment review <ArrowRight /></a></div>
          <div className="standard-list"><article><SearchCheck /><span><strong>Ask the right questions</strong><small>Product, dimensions, weight, packing, supplier timing and destination.</small></span></article><article><PackageCheck /><span><strong>Identify risk before booking</strong><small>Restrictions, documentation and handling requirements are raised early.</small></span></article><article><MessageCircle /><span><strong>Keep one direct contact</strong><small>Vinson coordinates the China-side plan and keeps communication practical.</small></span></article></div>
        </div>
      </section>

      <CompanyNetwork language={language} />

      <section className="promise">
        <div className="wrap promise-inner"><div className="quote-mark">“</div><blockquote>The goal is simple: make every China-side step understandable before the cargo moves.</blockquote><div><strong>OUR SERVICE PRINCIPLE</strong><span>Clear scope · Practical options · Direct communication</span></div></div>
      </section>

      <section className="insights section" id="insights">
        <div className="wrap"><div className="insights-head"><span className="kicker"><i /> LATEST INSIGHTS</span><h2>Useful guidance for importing from China.</h2><a className="text-link blog-view-all" href="/blog">View all articles <ArrowRight /></a></div><div className="insight-grid">{blogPosts.slice(0, 3).map((post, index) => <Reveal key={post.slug} delay={index * 80}><article className="media-hover-card"><a className="insight-visual" href={`/blog/${post.slug}`} aria-label={post.content[language].title}><img src={post.image.src} alt={post.image.alt[language]} width={1672} height={941} loading="lazy" /><span>{post.content[language].category}</span></a><small>{post.content[language].category}</small><h3><a href={`/blog/${post.slug}`}>{post.content[language].title}</a></h3><p>{post.content[language].summary}</p><a href={`/blog/${post.slug}`}>Read more <ArrowRight /></a></article></Reveal>)}</div></div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap contact-grid"><div><span className="kicker light"><i /> MOVE IN THE RIGHT DIRECTION</span><h2>Tell us what you need to source or ship.</h2><p>Send the cargo name, quantity, dimensions, weight, pickup city, destination and preferred shipping date.</p></div><EnquiryActions language={language} /></div>
      </section>
      </main>
      <SiteFooter language={language} />
      <a className="float-wa" href={enquiry.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp TengYoda Logistics"><MessageCircle /></a>
    </div>
  ), language);
}
