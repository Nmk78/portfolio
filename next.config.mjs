/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

  async redirects() {
    const domain = process.env.url || 'https://www.naymyokhant.online'

    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: domain,
          },
        ],
        destination: `${domain}/:path*`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig
