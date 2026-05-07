import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.1.32"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "matilha.digital",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "../.."),
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
