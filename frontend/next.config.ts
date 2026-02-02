import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Allow images from any domain (for custom branding logos)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 2. Allow Embedding (Iframe) support
  async headers() {
    return [
      {
        source: "/embed/:path*", // Apply only to embed routes
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "X-Frame-Options", value: "ALLOWALL" }, // Critical for iframes
          { key: "Content-Security-Policy", value: "frame-ancestors *" }, // Critical for modern browsers
        ],
      },
    ];
  },
};

export default nextConfig;