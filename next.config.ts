import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // shadcn fetches https urls as written, so /r/<slug> has to serve the json too
  async rewrites() {
    return [{ source: "/r/:slug([a-z0-9-]+)", destination: "/r/:slug.json" }];
  },
};

export default nextConfig;
