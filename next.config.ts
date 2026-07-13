import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pub-7e411a89c7ef486aace9c306d036d113.r2.dev" },
    ],
  },
};

export default nextConfig;
