import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 'unsafe-inline' stays for scripts/styles: Next.js injects inline hydration scripts
  // and inline styles that are difficult to replace with nonces in this setup.
  // 'unsafe-eval' is dev-only: React + Turbopack development builds require eval()
  // (callstack reconstruction, Fast Refresh). Without it, dev mode logs
  // "eval() is not supported in this environment" and dev tooling degrades.
  {
    key: "Content-Security-Policy",
    value:
      process.env.NODE_ENV === "production"
        ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
        : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src 'self'; connect-src 'self' ws: wss:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Dev-only: allow opening the dev server from this machine's LAN IP
  // (e.g. phone testing over Wi-Fi). Without this, Next 16 blocks
  // cross-origin dev resources (HMR socket, and in strict cases chunks),
  // which leaves client components dead with no render errors.
  allowedDevOrigins: ["192.168.1.18"],
  experimental: {
    optimizePackageImports: ["motion", "ogl"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;