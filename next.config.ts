import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [96, 128, 256, 384, 512, 640, 768, 1024, 1200, 1920],
  },
};

export default nextConfig;
