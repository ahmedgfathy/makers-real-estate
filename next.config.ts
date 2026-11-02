import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // The dashboard CSV upload validates against a 2 MB cap; the default
    // action body limit of 1 MB would reject the request before that check.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
