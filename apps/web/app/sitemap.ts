import { MetadataRoute } from 'next';
import productsBase from '../data/products/base.json';
import careersPositionsFr from '../data/careers/positions-fr.json';

type ProductEntry = { category: string; id: string };

const baseUrl = 'https://vmcl.fr';
const locales = ['fr', 'en'] as const;
const lastModified = new Date();

const basePages = [
  '',
  '/products',
  '/pricing',
  '/infrastructure',
  '/about',
  '/support',
  '/support/chat',
  '/support/tickets',
  '/configurator',
  '/careers',
  '/careers/spontaneous',
  '/login',
  '/forgot-password',
  '/terms',
  '/legal/terms',
  '/legal/dpa',
  '/legal/sla',
  '/legal/aup',
  '/legal/changes',
];

const productEntries: ProductEntry[] = Object.entries(productsBase).flatMap(([category, items]) => {
  const typedItems = Array.isArray(items) ? items : [];
  return typedItems
    .filter((item: any) => item?.id)
    .map((item: any) => ({ category, id: item.id as string }));
});

const activeJobIds: string[] = (careersPositionsFr.positions || [])
  .filter(position => position && position.active !== false)
  .map(position => position.id);

const buildAlternates = (path: string) => {
  const localizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const alternates = locales.reduce((acc, locale) => {
    const localePath = `${baseUrl}/${locale}${localizedPath}`;
    acc[locale] = localePath.endsWith('/') && localizedPath === '' ? localePath.slice(0, -1) : localePath;
    return acc;
  }, {} as Record<string, string>);
  alternates['x-default'] = `${baseUrl}${localizedPath}` || baseUrl;
  return alternates;
};

const buildUrl = (locale: string, path: string) => {
  if (!path) return `${baseUrl}/${locale}`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/${locale}${normalized}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    basePages.forEach(path => {
      const url = buildUrl(locale, path);
      entries.push({
        url,
        lastModified,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : path.startsWith('/products') || path.includes('pricing') ? 0.9 : 0.8,
        alternates: { languages: buildAlternates(path) },
      });
    });

    productEntries.forEach(({ category, id }) => {
      const productPath = `/products/${category}/${id}`;
      entries.push({
        url: buildUrl(locale, productPath),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: buildAlternates(productPath) },
      });
    });

    activeJobIds.forEach(jobId => {
      const jobPath = `/careers/${jobId}`;
      entries.push({
        url: buildUrl(locale, jobPath),
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: buildAlternates(jobPath) },
      });
    });
  });

  // Root entry with x-default fallback
  entries.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        'x-default': baseUrl,
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
      },
    },
  });

  return entries;
}
