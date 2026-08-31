import { ArrowRight } from "lucide-react";
import { serviceSeo } from "@/lib/seo";
import { getBlogPost } from "@/lib/blog-posts";
import type { Language } from "@/lib/localization";

export function ServiceSearchDetails({ slug, language }: { slug: string; language: Language }) {
  const seo = serviceSeo[slug];
  if (!seo) return null;
  const copy = seo.content[language];
  const guide = getBlogPost(seo.guideSlug);
  const zh = language === "zh-CN";
  return <section className="service-search-details" aria-labelledby="service-questions"><span className="kicker"><i />{zh ? "实用解答" : "PRACTICAL ANSWERS"}</span><h2 id="service-questions">{zh ? "发货前，先确认这些问题。" : "Clear answers before your cargo moves."}</h2><div className="service-questions">{copy.questions.map(item => <section key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></section>)}</div>{guide && <aside className="service-guide-link"><span>{zh ? "相关进口指南" : "RELATED IMPORT GUIDE"}</span><a href={`/blog/${guide.slug}`}>{guide.content[language].title}<ArrowRight aria-hidden="true" /></a></aside>}</section>;
}
