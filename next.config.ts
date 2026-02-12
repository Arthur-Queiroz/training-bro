import type { NextConfig } from "next";
// @ts-ignore - next-pwa has no type declarations
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
// @ts-ignore - next-pwa type mismatch
export default withPWA(nextConfig);
