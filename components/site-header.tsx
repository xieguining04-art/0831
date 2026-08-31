"use client";

import { useState } from "react";
import { ArrowRight, Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WorldClockBar } from "@/components/world-clock-bar";
import { orderedServices as services, serviceLabel, type ServiceLanguage } from "@/lib/services";
import { enquiryLinks } from "@/lib/company";

export function Brand() {
  return <a className="brand" href="/" aria-label="TengYoda Logistics home"><span><strong>TengYoda<span className="brand-chevron" aria-hidden="true">›</span></strong><small>GLOBAL LOGISTICS</small></span></a>;
}

export function SiteHeader({ language, onLanguageChange, active }: { language: ServiceLanguage; onLanguageChange: (language: ServiceLanguage) => void; active?: "blog" | "services" }) {
  const [navigationValue, setNavigationValue] = useState("");
  const servicesOpen = navigationValue === "services";
  const zh = language === "zh-CN";
  const quoteUrl = enquiryLinks().whatsapp;
  const links = [["/#about", zh ? "关于我们" : "About Us"], ["/blog", zh ? "博客" : "Blog"], ["/#contact", zh ? "联系我们" : "Contact Us"]];
  const serviceLinks = services.map(service => <NavigationMenuLink asChild key={service.slug}><a href={`/services/${service.slug}`} className="mega-service-link"><strong>{serviceLabel(service, language)}</strong><ArrowRight aria-hidden="true" /></a></NavigationMenuLink>);
  return <>
    <a className="skip-link" href="#main-content">{zh ? "跳至页面正文" : "Skip to main content"}</a>
    <WorldClockBar language={language} onLanguageChange={onLanguageChange} />
    <header className="main-header"><div className="wrap header-inner"><Brand />
      <NavigationMenu viewport={false} delayDuration={0} skipDelayDuration={0} value={navigationValue} onValueChange={setNavigationValue} className="site-navigation" aria-label={zh ? "主导航" : "Main navigation"}>
        <NavigationMenuList className="site-navigation-list">
          <NavigationMenuItem><NavigationMenuLink asChild><a className="nav-top-link" href="/#about">{zh ? "关于我们" : "About Us"}</a></NavigationMenuLink></NavigationMenuItem>
          <NavigationMenuItem
            value="services"
            className="mega-item"
            onPointerEnter={event => { if (event.pointerType === "mouse") setNavigationValue("services"); }}
            onPointerLeave={event => { if (event.pointerType === "mouse") setNavigationValue(""); }}
          ><NavigationMenuTrigger className="nav-top-trigger" data-active={active === "services"}>{zh ? "我们的服务" : "Our Services"}</NavigationMenuTrigger>
            <NavigationMenuContent forceMount className="services-mega" inert={!servicesOpen} aria-hidden={!servicesOpen}>
              <div className="mega-surface"><div className="wrap mega-layout"><div className="mega-main"><div className="mega-heading"><h2>{zh ? "我们的服务" : "Our services"}</h2><NavigationMenuLink asChild><a href="/services">{zh ? "查看全部" : "View all"}<ArrowRight /></a></NavigationMenuLink></div><div className="mega-links">{serviceLinks}</div><p className="mega-caption">{zh ? "海运优势航线 · 大洋洲 · 非洲 · 南美" : "SEA FREIGHT · OCEANIA · AFRICA · SOUTH AMERICA"}</p></div><aside className="mega-cta"><span className="kicker light">{zh ? "专人对接" : "ONE DIRECT CONTACT"}</span><h3>{zh ? <>需要<br />定制运输方案？</> : <>Need a tailored<br />shipping solution?</>}</h3><p>{zh ? "告诉我们您的货物与目的地，与 Vinson 一起规划中国端的每一步。" : "Tell us about your cargo and destination. Plan every China-side step with Vinson."}</p><a className="button accent" href={quoteUrl} target="_blank" rel="noreferrer">{zh ? "咨询专家" : "Speak to an expert"}<ArrowRight /></a></aside></div></div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {links.slice(1).map(([href, label]) => <NavigationMenuItem key={href}><NavigationMenuLink asChild active={href === "/blog" && active === "blog"}><a className="nav-top-link" href={href} aria-current={href === "/blog" && active === "blog" ? "location" : undefined}>{label}</a></NavigationMenuLink></NavigationMenuItem>)}
        </NavigationMenuList>
      </NavigationMenu>
      <a className="header-call" href={quoteUrl} target="_blank" rel="noreferrer"><span>{zh ? "需要定制物流方案？" : "NEED A CUSTOM SOLUTION?"}</span><b>{zh ? "咨询物流顾问" : "Speak to an expert"}</b><ArrowRight /></a>
      <Sheet><SheetTrigger asChild><Button className="menu-button" variant="ghost" size="icon" aria-label={zh ? "打开导航" : "Open navigation"}><Menu /></Button></SheetTrigger><SheetContent className="mobile-sheet"><SheetHeader><SheetTitle>TengYoda Logistics</SheetTitle><SheetDescription>{zh ? "全球海运订舱与中国端配套服务" : "Global sea freight booking and China-side support"}</SheetDescription></SheetHeader><nav className="mobile-nav" aria-label={zh ? "手机导航" : "Mobile navigation"}><SheetClose asChild><a href="/">{zh ? "首页" : "Home"}</a></SheetClose><SheetClose asChild><a href="/#about">{links[0][1]}</a></SheetClose><Accordion type="single" collapsible className="mobile-service-menu"><AccordionItem value="services"><AccordionTrigger>{zh ? "我们的服务" : "Our Services"}</AccordionTrigger><AccordionContent><SheetClose asChild><a href="/services">{zh ? "查看全部服务" : "View all services"}</a></SheetClose>{services.map(service => <SheetClose key={service.slug} asChild><a href={`/services/${service.slug}`}>{serviceLabel(service, language)}</a></SheetClose>)}</AccordionContent></AccordionItem></Accordion>{links.slice(1).map(([href, label]) => <SheetClose asChild key={href}><a href={href}>{label}</a></SheetClose>)}</nav><a className="mobile-contact" href={quoteUrl} target="_blank" rel="noreferrer"><MessageCircle /> +86 186 2024 4613</a></SheetContent></Sheet>
    </div></header>
  </>;
}
