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
  /**
   * Default is 60s. Every prerendered page here opens with several Prisma
   * queries against a Neon instance in us-east, and a build run from a slow or
   * distant link spends most of that budget on round-trips rather than on
   * rendering — /journal fetches posts, categories, contact and settings before
   * it can emit a byte. Netlify builds in the same region and never comes close;
   * this only buys headroom for builds run from elsewhere, and costs nothing
   * when the queries are fast.
   */
  staticPageGenerationTimeout: 300,
  /**
   * The four original service pages were broad SEO landing pages; the service
   * list is now 28 focused pages under four departments. These are permanent
   * moves, not deletions — each old URL is indexed and has whatever authority it
   * earned, so it is 301'd to the new page closest to its topic rather than
   * left to 404. Keep in sync with RETIRED in prisma/seed-services.ts.
   *
   * `statusCode: 301` rather than `permanent: true`, which emits 308. The two
   * are equivalent to Google, but 301 is the code every other crawler, log
   * pipeline and CDN in the stack already understands.
   */
  async redirects() {
    return [
      { source: "/services/branding-and-digital-marketing-services", destination: "/services/digital-strategy", statusCode: 301 },
      { source: "/services/web-design-and-seo-services", destination: "/services/web-development", statusCode: 301 },
      { source: "/services/graphic-design-logo-visual-identity", destination: "/services/logo-design", statusCode: 301 },
      { source: "/services/content-creation-and-social-media-management", destination: "/services/social-media-management", statusCode: 301 },
    ];
  },
};

export default nextConfig;
