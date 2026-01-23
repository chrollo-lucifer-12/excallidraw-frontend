import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      new URL(
        "https://swcxwcivbezgmunayqlf.supabase.co/storage/v1/object/public/images/**",
      ),
    ],
  },
  output: "standalone",
};

export default nextConfig;
