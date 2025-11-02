import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Asegurar que los binarios nativos se incluyan en el build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
