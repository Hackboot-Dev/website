// apps/web/app/[locale]/news/page.tsx
// Description: News page with category carousels and featured articles
// Last modified: 2025-11-15

import { Metadata } from 'next';
import NewsPageClient from './NewsPageClient';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const title = locale === 'fr'
    ? 'Actualités VMCloud | News, Produits, Tech & Communauté'
    : 'VMCloud News | Updates, Products, Tech & Community';

  const description = locale === 'fr'
    ? 'Découvrez les dernières actualités VMCloud : nouveaux produits, articles techniques, insights infrastructure et événements communauté.'
    : 'Discover the latest VMCloud news: new products, technical articles, infrastructure insights, and community events.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://vmcloud.net/${locale}/news`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://vmcloud.net/${locale}/news`,
      languages: {
        'fr-FR': 'https://vmcloud.net/fr/news',
        'en-US': 'https://vmcloud.net/en/news',
      },
    },
  };
}

export default function NewsPage({ params: { locale } }: { params: { locale: string } }) {
  return <NewsPageClient locale={locale} />;
}
