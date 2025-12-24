import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '6ljz73mw-8000.inc1.devtunnels.ms',
      },
    ],
  },
};

export default nextConfig;
