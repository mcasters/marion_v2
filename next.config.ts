import type { NextConfig } from "next";
// import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [768, 1200],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  /*outputFileTracingRoot: path.join(
    __dirname,
    "../../nodevenv/public_html/marion_v1_4/22/lib/",
  ),*/
};
module.exports = nextConfig;
