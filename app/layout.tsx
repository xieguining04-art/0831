import type { Metadata } from "next";
import { homeSeo, pageMetadata } from "@/lib/seo";
import { SiteAnalytics } from "@/components/site-analytics";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMetadata(homeSeo.title, homeSeo.description, "/"),
  icons: {
    icon: "/favicon.svg?v=tengyoda-2",
    shortcut: "/favicon.svg?v=tengyoda-2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}<SiteAnalytics /></body>
    </html>
  );
}
