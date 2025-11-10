import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your other config here
  images: {
    domains: ['pgcdigital.ai', 'firebasestorage.googleapis.com', 'picsum.photos'],
  },
};

export default nextConfig