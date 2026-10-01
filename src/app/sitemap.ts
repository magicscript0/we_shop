import type { MetadataRoute } from 'next';
import { SEED_PLANS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://we-store.eg';
  const now = new Date();

  const staticPages = [
    '',
    '/plans',
    '/renew',
    '/track',
    '/support',
    '/about',
    '/terms',
    '/privacy',
    '/refund',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const planPages = SEED_PLANS.map((plan) => ({
    url: `${siteUrl}/plans/${plan.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...planPages];
}
