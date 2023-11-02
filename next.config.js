/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "omlogistics.co.in",
      },
      {
        protocol: "https",
        hostname: "www.seekpng.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
  },
};

module.exports = nextConfig;
