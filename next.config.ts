import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Middleware handles API proxying now.
  // We keep the config minimal to avoid build-time env issues.
};

export default nextConfig;