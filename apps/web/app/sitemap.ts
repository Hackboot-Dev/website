import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vmcl.fr';
  const locales = ['fr', 'en'];
  const lastModified = new Date();

  // Pages principales
  const mainPages = [
    '',
    '/products', 
    '/pricing',
    '/infrastructure',
    '/support',
    '/legal/terms',
    '/legal/dpa',
    '/legal/sla',
    '/legal/aup',
  ];

  // Catégories de produits
  const productCategories = ['vps', 'gpu', 'webhosting', 'paas', 'loadbalancer', 'storage', 'cdn'];
  
  // Produits spécifiques (exemples)
  const products = [
    '/products/vps/vps-nano',
    '/products/vps/vps-starter',
    '/products/vps/vps-performance',
    '/products/vps/vps-business',
    '/products/vps/vps-enterprise',
    '/products/gpu/gpu-t4',
    '/products/gpu/gpu-rtx4090',
    '/products/gpu/gpu-a100',
    '/products/webhosting/web-starter',
    '/products/webhosting/web-pro',
    '/products/webhosting/web-business',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Génération des entrées pour chaque langue
  locales.forEach(locale => {
    // Pages principales
    mainPages.forEach(page => {
      const url = `${baseUrl}/${locale}${page}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page.includes('products') || page.includes('pricing') ? 0.9 : 0.8,
        alternates: {
          languages: locales.reduce((acc, l) => {
            acc[l] = `${baseUrl}/${l}${page}`;
            return acc;
          }, {} as Record<string, string>)
        }
      });
    });

    // Pages produits
    products.forEach(product => {
      const url = `${baseUrl}/${locale}${product}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: locales.reduce((acc, l) => {
            acc[l] = `${baseUrl}/${l}${product}`;
            return acc;
          }, {} as Record<string, string>)
        }
      });
    });
  });

  // Page racine avec x-default
  entries.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        'x-default': baseUrl,
        'fr': `${baseUrl}/fr`,
        'en': `${baseUrl}/en`
      }
    }
  });

  return entries;
}