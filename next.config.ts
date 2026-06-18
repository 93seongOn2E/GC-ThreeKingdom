import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: isDev ? ".next-dev" : ".next"
};

export default nextConfig;
