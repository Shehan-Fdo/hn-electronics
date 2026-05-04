/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hnelectronics-127f13b.ingress-earth.ewp.live"
      }
    ]
  }
};

module.exports = nextConfig;
