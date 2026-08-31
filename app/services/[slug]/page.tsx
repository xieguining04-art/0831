import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceView } from "@/components/service-view";
import { services, getService } from "@/lib/services";
import { serviceSeo, pageMetadata } from "@/lib/seo";

export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found | TengYoda Logistics", robots: { index: false } };
  const seo = serviceSeo[service.slug];
  return pageMetadata(seo.title, seo.description, `/services/${service.slug}`);
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServiceView service={service} />;
}
