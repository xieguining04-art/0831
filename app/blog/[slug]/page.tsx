import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogView } from "@/components/blog-view";
import { blogPosts, getBlogPost } from "@/lib/blog-posts";
import { blogSeo, pageMetadata } from "@/lib/seo";

export function generateStaticParams() { return blogPosts.map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article not found | TengYoda Logistics", robots: { index: false } };
  const seo = blogSeo[post.slug];
  return pageMetadata(seo?.title ?? `${post.content.en.title} | TengYoda Logistics`, seo?.description ?? post.content.en.summary, `/blog/${post.slug}`);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return <BlogView post={post} />;
}
