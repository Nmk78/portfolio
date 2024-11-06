import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.url || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/management/', '/auth/*'], // Add multiple disallowed paths here
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
