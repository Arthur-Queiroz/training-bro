import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Silencia o erro do turbopack/webpack
  turbopack: {},
};
// @ts-expect-error - next-pwa type
export default withPWA(nextConfig);
