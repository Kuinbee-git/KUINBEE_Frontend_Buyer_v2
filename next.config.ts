import { deploymentEnvironment } from './scripts/deployment-environment.mjs';
import type { NextConfig } from "next";

const deployment = deploymentEnvironment();

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    qualities: [75, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...(deployment.isStaging ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : []),
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/analytics",
        destination: "/strotas",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "kuinbee.com",
          },
        ],
        destination: "https://www.kuinbee.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "marketplace.kuinbee.com",
          },
        ],
        destination: "https://www.kuinbee.com/:path*",
        permanent: true,
      },
    ];
  },
  experimental: {
    ...(process.env.CI ? { cpus: 2 } : {}),
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
