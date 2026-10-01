import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Self-contained server (.next/standalone) for the production Docker image
  output: "standalone",
};

export default nextConfig;
