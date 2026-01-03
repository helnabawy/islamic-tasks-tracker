import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable standalone output for development
  // output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
