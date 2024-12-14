import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // Disable TypeScript checks during the build process
  },
};

export default nextConfig;
