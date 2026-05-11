import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["54.232.189.113", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
