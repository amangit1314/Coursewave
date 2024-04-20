// const { withNextVideo } = require('next-video\process')

/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "omlogistics.co.in",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "www.seekpng.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "media.geeksforgeeks.org",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      }
    ],
  },
};

module.exports = nextConfig
  // withNextVideo(nextConfig);
