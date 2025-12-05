/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : null;

const connectSrc = [
  "'self'",
  "https://sdk.minepi.com",
  "https://api.minepi.com",
  "https://api.pinet.minepi.com",
  "https://sandbox-api.minepi.com",
  "https://socialchain.network",
  "https://socialchain.app",
  "https://api.socialchain.app",
  "https://k8s-mainnet-fe.piapps-network.org",
];

if (supabaseHost) {
  connectSrc.push(`https://${supabaseHost}`, `wss://${supabaseHost}`);
}

const imgSrc = [
  "'self'",
  "data:",
  "blob:",
  "https://images.unsplash.com",
  "https://images.ctfassets.net",
];

if (supabaseHost) {
  imgSrc.push(`https://${supabaseHost}`);
}

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.minepi.com",
  `connect-src ${connectSrc.join(" ")}`,
  `img-src ${imgSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "frame-ancestors 'self'",
].map((directive) => `${directive};`).join(" ");

const securityHeaders = [
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  },
];

// Temporarily disable CSP to avoid ERR_BLOCKED_BY_RESPONSE; toggle via ENABLE_CSP.
if (process.env.ENABLE_CSP === "true") {
  securityHeaders.push({
    key: "Content-Security-Policy",
    value: csp.replace(/\s{2,}/g, " ").trim(),
  });
}

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
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig
