import type { Metadata } from 'next';
import { getEnrichedProductData } from '../../../../../utils/productDataLoader';

type Params = { params: { locale: string; category: string; slug: string } };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function generateMetadata({ params }: Params): Metadata {
  const { locale, category, slug } = params;
  const language = locale === 'en' ? 'en' : 'fr';
  const catalog = getEnrichedProductData(language as 'en' | 'fr');
  const categoryProducts = (catalog as any)[category] || [];
  const product = categoryProducts.find((item: any) => {
    const slugFromName = slugify(item.name || '');
    const slugFromId = slugify(item.id || '');
    return slug === item.id || slug === slugFromName || slug === slugFromId;
  });

  const formatCurrency = (value?: number) =>
    typeof value === 'number'
      ? new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }).format(value)
      : undefined;

  const fallbackTitle = language === 'en'
    ? 'VMCloud Product Detail'
    : 'Fiche produit VMCloud';

  const monthlyPrice = product?.monthly ? formatCurrency(product.monthly) : undefined;
  const title = product
    ? language === 'en'
      ? `${product.name} – ${monthlyPrice ? `${monthlyPrice}/month` : 'VMCloud'} | VMCloud`
      : `${product.name} – ${monthlyPrice ? `${monthlyPrice}/mois` : 'VMCloud'} | VMCloud`
    : fallbackTitle;

  const baseDescription = product?.description || product?.highlight;
  const description = product
    ? language === 'en'
      ? `${baseDescription || 'High-performance sovereign cloud service'} ${monthlyPrice ? `Plans start at ${monthlyPrice}/month with 24/7 support and 99.99% SLA.` : ''}`.trim()
      : `${baseDescription || 'Service cloud souverain haute performance'} ${monthlyPrice ? `Offres dès ${monthlyPrice}/mois avec support 24/7 et SLA 99,99%.` : ''}`.trim()
    : language === 'en'
      ? 'Discover sovereign VMCloud products with NVMe compute, GPU acceleration and managed services.'
      : 'Découvrez les produits souverains VMCloud avec compute NVMe, accélération GPU et services managés.';

  const keywords = product
    ? [
        product.name,
        product.category,
        ...(product.features || []).slice(0, 4),
        language === 'en' ? 'VMCloud' : 'VMCloud',
        language === 'en' ? 'sovereign cloud' : 'cloud souverain',
      ].filter(Boolean).join(', ')
    : language === 'en'
      ? 'VMCloud product, sovereign cloud, NVMe VPS, GPU computing'
      : 'produit VMCloud, cloud souverain, VPS NVMe, calcul GPU';

  const canonicalPath = `/${locale}/products/${category}/${slug}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: language === 'en' ? 'en_US' : 'fr_FR',
      url: `https://vmcl.fr${canonicalPath}`,
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${product?.name || fallbackTitle} – VMCloud`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/${locale}/twitter-image`],
    },
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': `https://vmcl.fr${canonicalPath}`,
        'en-US': `https://vmcl.fr/en/products/${category}/${slug}`,
        'fr-FR': `https://vmcl.fr/fr/products/${category}/${slug}`,
      },
    },
  };
}

export default function DynamicProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
