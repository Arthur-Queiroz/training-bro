import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  headers: async () => [
    {
      source: "/sign-in/:path*",
      headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
    },
    {
      source: "/sign-up/:path*",
      headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
    },
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
  ],
};

export default nextConfig;
