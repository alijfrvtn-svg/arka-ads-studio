import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Left unoptimized on purpose: nearly all real media is uploaded to the
    // Media Library and served same-origin from /api/media/[key], which is
    // already a dynamic route — routing it through the optimizer as well just
    // adds a second function hop per image. Revisit if media ever moves to a
    // static CDN prefix.
    unoptimized: true,
    // Hosts an admin may legitimately paste a URL from. The former sample hosts
    // (picsum.photos, i.pravatar.cc, fastly.picsum.photos) are gone — they are
    // unreachable from Iran and were a direct cause of the slow first paint.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "static.cdn.asset.aparat.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
