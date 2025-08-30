import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/hacker03/**"
      }
    ]
  },
   serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
