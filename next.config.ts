import type { NextConfig } from "next";
import { join } from "node:path";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [768, 1200],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  turbopack: {
    root: join(__dirname, ".."),
  },
};
module.exports = nextConfig;
