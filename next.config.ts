import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        {
          key: "Access-Control-Allow-Origin",
          value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
        { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, Authorization",
        },
      ],
    },
  ],
};

export default nextConfig;
