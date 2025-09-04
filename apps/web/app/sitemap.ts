import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://vmcl.fr';
  const now = new Date();

  const routes = [
    '/',
    '/fr',
    '/products',
    '/pricing',
    '/support',
    // Expose docs only in non-production (middleware blocks in prod)
    ...(process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production' ? [] : ['/docs']),
    '/legal/terms',
    '/legal/sla',
    '/legal/aup',
    '/legal/dpa',
    '/infrastructure',
    '/terms',
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
