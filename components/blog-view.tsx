"use client";

import { ArrowLeft, ArrowRight, Clock3, MessageCircle } from "lucide-react";
import { useSiteLanguage } from "@/components/world-clock-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryActions } from "@/components/enquiry-actions";
import { Reveal } from "@/components/motion";
import { blogPosts, formatBlogDate, readingMinutes, type BlogLanguage, type BlogPost } from "@/lib/blog-posts";

import { enquiryLinks } from "@/lib/company";
import { blogSeo } from "@/lib/seo";
import { getService, serviceLabel, type Service } from "@/lib/services";

function PostCard({ post, language, index }: { post: BlogPost; language: BlogLanguage; index: number }) {
  const content = post.content[language];
  return <Reveal delay={(index % 3) * 80}><article className="blog-card media-hover-card">
    <a className="insight-visual" href={`/blog/${post.slug}`} aria-label={content.title}><img src={post.image.src} alt={post.image.alt[language]} width={1672} height={941} loading="lazy" /><span>{content.category}</span></a>
    <div className="blog-card-body"><div className="blog-meta"><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, language)}</time><span><Clock3 aria-hidden="true" />{readingMinutes(content, language)} {language === "en" ? "min read" : "分钟阅读"}</span></div>
      <h2><a href={`/blog/${post.slug}`}>{content.title}</a></h2><p>{content.summary}</p>
      <a className="text-link" href={`/blog/${post.slug}`}>{language === "en" ? "Read article" : "阅读文章"}<ArrowRight /></a>
    </div>
  </article></Reveal>;
}

export function BlogView({ post }: { post?: BlogPost }) {
  const { language, changeLanguage } = useSiteLanguage();
  const zh = language === "zh-CN";
  const content = post?.content[language];
  const linkedServices = (post ? blogSeo[post.slug]?.serviceSlugs ?? [] : []).map(getService).filter((service): service is Service => Boolean(service));
  const topic = post ? `your article: ${post.content.en.title}` : "China sourcing and freight";
  const quoteUrl = enquiryLinks(topic).whatsapp;

  return <div className="site blog-site" id="top">
    <SiteHeader language={language} onLanguageChange={changeLanguage} active="blog" />

    <main id="main-content" tabIndex={-1}>
      <section className={`blog-hero page-enter ${post ? "blog-article-hero editorial-hero" : "blog-index-hero"}`}>
        {post && <><img className="editorial-photo" src={post.image.src} alt={post.image.alt[language]} width={1672} height={941} fetchPriority="high" /><div className="editorial-shade" /></>}
        <div className="wrap">
        <nav className="blog-breadcrumb" aria-label={zh ? "面包屑导航" : "Breadcrumb"}><a href="/">{zh ? "首页" : "Home"}</a><span>/</span>{post ? <><a href="/blog">{zh ? "博客" : "Blog"}</a><span>/</span><span>{content?.category}</span></> : <span>{zh ? "博客" : "Blog"}</span>}</nav>
        <span className="kicker light"><i />{content?.category ?? (zh ? "TENGYODA 物流博客" : "THE TENGYODA JOURNAL")}</span>
        <h1>{content?.title ?? (zh ? "读懂中国采购与全球运输。" : "A clearer view of sourcing and shipping from China.")}</h1>
        <p>{content?.summary ?? (zh ? "面向海外进口商的实用指南：采购准备、运输方式与物流风险。" : "Practical articles for overseas importers, covering purchase preparation, transport options and shipment risks.")}</p>
        {post && content && <div className="blog-meta"><span>{post.author}</span><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, language)}</time><span><Clock3 aria-hidden="true" />{readingMinutes(content, language)} {zh ? "分钟阅读" : "min read"}</span></div>}
      </div></section>

      {!post && <section className="blog-index"><div className="wrap"><div className="blog-index-heading"><h2>{zh ? "最新文章" : "Latest articles"}</h2><span>{blogPosts.length} {zh ? "篇指南" : "guides"}</span></div><div className="blog-card-grid">{blogPosts.map((item, index) => <PostCard key={item.slug} post={item} language={language} index={index} />)}</div></div></section>}

      {post && content && <>
        <div className="wrap blog-reading-grid">
          <aside className="blog-toc"><nav aria-label={zh ? "文章目录" : "Article contents"}><h2>{zh ? "文章目录" : "In this article"}</h2>{content.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.heading}</a>)}</nav><a className="text-link" href="/blog"><ArrowLeft />{zh ? "返回全部文章" : "Back to all articles"}</a></aside>
          <article className="blog-prose"><p className="blog-lead">{content.introduction}</p>{content.sections.map(section => <Reveal key={section.id}><section id={section.id}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}</section></Reveal>)}<div className="blog-note">{zh ? "本文为一般运输准备指南。具体要求、收费及承运条件取决于货物、路线和目的地，请在订舱前核实。" : "General planning guidance. Requirements, charges and carrier acceptance depend on the cargo, route and destination; confirm shipment-specific details before booking."}</div></article>
        </div>
        {linkedServices.length > 0 && <section className="blog-service-links"><div className="wrap"><div className="blog-index-heading"><h2>{zh ? "将指南用于您的运输计划" : "Services for your shipping plan"}</h2></div><div className="related-service-links">{linkedServices.map(service => <a href={`/services/${service.slug}`} key={service.slug}>{serviceLabel(service, language)}<ArrowRight aria-hidden="true" /></a>)}</div></div></section>}
        <section className="blog-related"><div className="wrap"><div className="blog-index-heading"><h2>{zh ? "继续阅读" : "Keep reading"}</h2><a className="text-link" href="/blog">{zh ? "全部文章" : "All articles"}<ArrowRight /></a></div><div className="blog-card-grid blog-related-grid">{blogPosts.filter(item => item.slug !== post.slug).slice(0, 2).map((item, index) => <PostCard key={item.slug} post={item} language={language} index={index + 1} />)}</div></div></section>
      </>}

      <section className="blog-cta"><div className="wrap"><div><span className="kicker light"><i />{zh ? "把指南变成可执行的运输计划" : "FROM READING TO A SHIPPING PLAN"}</span><h2>{zh ? "讨论您的中国采购或运输需求。" : "Let's talk about your next shipment."}</h2><p>{zh ? "请提供品名、数量、包装尺寸、毛重、提货城市和目的地。" : "Share the product, quantity, packed dimensions, gross weight, pickup city and destination."}</p></div><EnquiryActions language={language} topic={topic} /></div></section>
    </main>

    <SiteFooter language={language} />
    <a className="float-wa" href={quoteUrl} target="_blank" rel="noreferrer" aria-label={zh ? "通过 WhatsApp 联系 TengYoda" : "Contact TengYoda on WhatsApp"}><MessageCircle /></a>
  </div>;
}
