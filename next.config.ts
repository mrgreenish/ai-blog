import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Article routes → chapter routes
      { source: "/models/:slug",     destination: "/chapters/:slug", permanent: true },
      { source: "/workflows/:slug",  destination: "/chapters/:slug", permanent: true },
      { source: "/tooling/:slug",    destination: "/chapters/:slug", permanent: true },
      { source: "/notes/:slug",      destination: "/chapters/:slug", permanent: true },
      // Category landing pages → home
      { source: "/models",    destination: "/", permanent: true },
      { source: "/workflows", destination: "/", permanent: true },
      { source: "/tooling",   destination: "/", permanent: true },
      { source: "/notes",     destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
