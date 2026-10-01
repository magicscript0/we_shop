import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://we-store.eg';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/pay/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
