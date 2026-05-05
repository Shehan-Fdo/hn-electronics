/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hnelectronics-127f13b.ingress-earth.ewp.live"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/:path*',
        destination: 'https://hnelectronics-127f13b.ingress-earth.ewp.live/wp-content/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
