/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "pub-1bf4c41a11914900a0a34a31e2b4cb59.r2.dev"
      },
      {
        protocol: "https",
        hostname: "hn-backend.shehan-dev.workers.dev"
      }
    ]
  }
};

module.exports = nextConfig;
