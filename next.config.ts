import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Product images from the shop admin still go through a server action;
      // gallery photos upload directly to storage and are unaffected.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
