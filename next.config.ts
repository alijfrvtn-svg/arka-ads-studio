import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Sample hosts (Picsum/Pravatar) 302-redirect to signed CDN URLs that Next's
    // server-side optimizer can't proxy (403). Load them directly in the browser.
    // In production with your own S3/CDN, remove this to re-enable optimization.
    unoptimized: true,
    // Remote sample media (portfolio covers, avatars, client logos, BTS video posters).
    // Swap these hosts for your own S3/CDN in production.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
