import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Static page HTML — cache in browser for 10 min, CDN for 1 year,
        // serve stale for up to 1 day while revalidating in the background.
        // Reduces bandwidth from repeat visitors between deploys.
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=600, s-maxage=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Article routes → chapter routes
      { source: "/models/:slug",     destination: "/chapters/:slug", permanent: true },
      { source: "/workflows/:slug",  destination: "/chapters/:slug", permanent: true },
      { source: "/tooling/:slug",    destination: "/chapters/:slug", permanent: true },
      { source: "/notes/:slug",      destination: "/chapters/:slug", permanent: true },
      // Renamed chapters
      { source: "/chapters/on-my-radar", destination: "/chapters/what-is-happening", permanent: true },
      // Category landing pages → home
      { source: "/models",    destination: "/", permanent: true },
      { source: "/workflows", destination: "/", permanent: true },
      { source: "/tooling",   destination: "/", permanent: true },
      { source: "/notes",     destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
