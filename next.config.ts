import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The normal Sites build stays server-backed. The download-only release
  // target pre-renders the same app for an ordinary static web server.
  ...(process.env.TENGYODA_STATIC_EXPORT === "1"
    ? { output: "export" as const, trailingSlash: true }
    : {}),
};

export default nextConfig;
