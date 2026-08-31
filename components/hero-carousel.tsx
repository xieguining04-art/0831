"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useReducedMotion } from "@/components/motion";
import type { Language } from "@/lib/localization";

const slides = [
  { image: "/images/sea-freight.webp", href: "/services/sea-freight", en: { label: "OUR MAIN SERVICE · GLOBAL SEA FREIGHT", title: "Global sea freight bookings. From China to the world.", text: "FCL and LCL shipping, with a focus on Oceania, Africa and South America. Plan your container booking with one China-side contact.", link: "Explore sea freight", alt: "Container ship at an international port" }, "zh-CN": { label: "主营推荐 · 全球海运订舱", title: "全球海运订舱，从中国连接世界。", text: "主营整柜与拼箱海运，优势航线：大洋洲、非洲、南美。由中国端专人对接，协调您的订舱与出运计划。", link: "了解海运订舱", alt: "国际港口内的集装箱船" } },
  { image: "/images/warehouse-operations.webp", href: "/services/cargo-consolidation", en: { label: "CHINA-SIDE SUPPORT & CONSOLIDATION", title: "Supplier orders, brought together for shipping.", text: "Factory pickup, procurement support and warehouse consolidation complement your international shipment. One China-side team, every step connected.", link: "Explore consolidation", alt: "Palletised cargo and a forklift in a logistics warehouse" }, "zh-CN": { label: "中国端配套 · 仓储集运", title: "汇集供应商货物，衔接国际出运。", text: "工厂提货、采购协调与仓库集运，为国际运输提供中国端配套支持，由专人协调衔接。", link: "了解货物集运", alt: "物流仓库内的托盘货物与叉车" } },
  { image: "/images/air-freight.webp", href: "/services/air-freight", en: { label: "AIR FREIGHT & EXPRESS", title: "When time matters, keep your cargo moving.", text: "China-origin air freight and international express options, planned around your cargo, deadline and destination.", link: "Explore air freight", alt: "Cargo aircraft with a pallet loader on the apron" }, "zh-CN": { label: "国际空运与快递", title: "时效至关重要，让急货先行一步。", text: "中国始发空运及国际快递方案，根据货物情况、时间要求与目的地灵活安排。", link: "了解空运服务", alt: "停机坪上的货机与货物升降平台" } },
];

export function HeroCarousel({ language }: { language: Language }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const toggleIntent = useRef<boolean | null>(null);
  const reduced = useReducedMotion();
  const zh = language === "zh-CN";
  const running = playing && !hovered && visible && !reduced;
  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    const stopOnDrag = () => setPlaying(false);
    update(); api.on("select", update); api.on("reInit", update); api.on("pointerDown", stopOnDrag);
    return () => { api.off("select", update); api.off("reInit", update); api.off("pointerDown", stopOnDrag); };
  }, [api]);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!api || !running) return;
    const timer = window.setInterval(() => api.scrollNext(), 7000);
    return () => window.clearInterval(timer);
  }, [api, running, selected]);

  return <section className="hero dynamic-hero" data-playing={running} aria-label={zh ? "主营服务轮播" : "Featured logistics services"}>
    <Carousel setApi={setApi} opts={{ loop: true, duration: reduced ? 0 : 35 }} className="hero-carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPlaying(false)} aria-label={zh ? "服务横幅" : "Service banners"}>
      <CarouselContent className="hero-track" aria-live={running ? "off" : "polite"}>
        {slides.map((slide, index) => { const copy = slide[language]; const active = index === selected; return <CarouselItem key={slide.image} className={`hero-slide ${active ? "is-active" : ""}`} aria-label={`${index + 1} / ${slides.length}`} aria-hidden={!active} inert={!active}>
          <img className="hero-photo" src={slide.image} alt={copy.alt} width={1672} height={941} fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} />
          <div className="hero-shade" /><div className="direction-mark" aria-hidden="true" />
          <div className="wrap hero-content"><span className="kicker light"><i />{copy.label}</span>{index === 0 ? <h1>{copy.title}</h1> : <h2>{copy.title}</h2>}<p>{copy.text}</p><div className="hero-actions"><a className="button accent" href={slide.href}>{copy.link}<ArrowRight /></a><a className="text-link light-link" href="#services">{zh ? "查看全部服务" : "All services"}<ArrowDown /></a></div></div>
        </CarouselItem>; })}
      </CarouselContent>
      <div className="hero-controls wrap"><div className="hero-pagination">{slides.map((slide, index) => <button type="button" key={slide.image} aria-label={`${zh ? "切换到" : "Go to"} ${slide[language].label}`} aria-pressed={selected === index} onClick={() => { setPlaying(false); api?.scrollTo(index, reduced); }}><span>0{index + 1}</span><i /></button>)}</div><div className="hero-control-buttons"><button type="button" aria-label={zh ? "上一张" : "Previous slide"} onClick={() => { setPlaying(false); api?.scrollPrev(reduced); }}><ArrowLeft /></button><button type="button" aria-label={zh ? "下一张" : "Next slide"} onClick={() => { setPlaying(false); api?.scrollNext(reduced); }}><ArrowRight /></button>{!reduced && <button type="button" data-slideshow-toggle aria-label={playing ? (zh ? "暂停轮播" : "Pause slideshow") : (zh ? "播放轮播" : "Play slideshow")} onPointerDown={() => { toggleIntent.current = !playing; }} onPointerCancel={() => { toggleIntent.current = null; }} onKeyDown={() => { toggleIntent.current = null; }} onBlur={() => { toggleIntent.current = null; }} onClick={() => { setPlaying(toggleIntent.current ?? !playing); toggleIntent.current = null; }}>{playing ? <Pause /> : <Play />}</button>}</div></div>
    </Carousel>
    <div className="hero-rail" aria-hidden="true"><span>GLOBAL FREIGHT</span><i /><span>CHINA ORIGIN</span></div>
  </section>;
}
