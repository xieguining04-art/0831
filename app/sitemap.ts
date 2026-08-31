import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";
import { services } from "@/lib/services";
import { siteOrigin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin;
  return [
    { url: origin, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/services`, changeFrequency: "monthly", priority: 0.9 },
    ...services.map(service => ({ url: `${origin}/services/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...blogPosts.map(post => ({ url: `${origin}/blog/${post.slug}`, lastModified: `${post.publishedAt}T00:00:00Z`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
