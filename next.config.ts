import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/task-inbox",
  images: { unoptimized: true },
};

export default nextConfig;
