import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  // Product photos uploaded by shops through the admin app.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eutfesbuptqntoaxyzmu.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
      },
    ],
  },
};
export default nextConfig;
