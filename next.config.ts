import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [768, 1200],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  outputFileTracingRoot: path.join(
    __dirname,
    "./",
  ),
};
module.exports = nextConfig;
