import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel-ready: no custom output; standard build/start commands. */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
