import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ["http://192.168.18.99:3000"],
};

export default nextConfig;
