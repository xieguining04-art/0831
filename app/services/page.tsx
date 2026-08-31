import type { Metadata } from "next";
import { ServiceView } from "@/components/service-view";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Global Sea Freight & China Logistics Services | TengYoda", "Explore global sea freight booking, focused on Oceania, Africa and South America, plus air cargo, express, procurement, consolidation and China road transport.", "/services");
export default function ServicesPage() { return <ServiceView />; }
