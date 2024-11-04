/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Allow images from any domain
        },
        {
          protocol: 'http',
          hostname: '**', // If you want to allow images from any HTTP domain as well
        },
      ],
    },
  };
  
  export default nextConfig;
  