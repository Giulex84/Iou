/** @type {import('next').NextConfig} */
const csp = [
  "default-src 'self';",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.minepi.com;",
  "connect-src 'self' https://sdk.minepi.com https://api.minepi.com https://api.pinet.minepi.com https://socialchain.network https://socialchain.app https://api.socialchain.app https://k8s-mainnet-fe.piapps-network.org;",
  "img-src 'self' data: blob:;",
  "style-src 'self' 'unsafe-inline';",
  "frame-ancestors 'self';",
].join(" ");

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          {
            key: "Content-Security-Policy",
            value: csp.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig
