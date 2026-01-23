import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      new URL(
        "https://swcxwcivbezgmunayqlf.supabase.co/storage/v1/object/public/images/**",
      ),
    ],
  },
};

export default nextConfig;
