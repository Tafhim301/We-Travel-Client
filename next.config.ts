import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",  // allow any HTTPS image
      },
      {
        protocol: "http",
        hostname: "**",  // allow any HTTP image
      },
    ],
  },
};

export default nextConfig;
