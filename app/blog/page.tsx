import type { Metadata } from "next";
import { BlogView } from "@/components/blog-view";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Importing from China: Sourcing & Shipping Guides | TengYoda", "Guides for importing from China: supplier checks, express vs air freight, FCL vs LCL shipping and destination charges. Plan your next import with TengYoda.", "/blog");

export default function BlogPage() { return <BlogView />; }
