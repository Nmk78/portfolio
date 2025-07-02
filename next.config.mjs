/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://cdn.clerk.dev https://*.clerk.accounts.dev https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline';
              img-src * blob: data:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src *;
              frame-src https://*.clerk.dev https://*.clerk.accounts.dev;
              object-src 'none';
              base-uri 'self';
            `.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
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
            value: "geolocation=(), microphone=()",
          },
        ],
      },
    ];
  },

  async redirects() {
    const domain = process.env.url || "https://www.naymyokhant.online";

    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: domain,
          },
        ],
        destination: `${domain}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
