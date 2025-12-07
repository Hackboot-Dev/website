import { Metadata } from 'next';
import ChangelogPageClient from './ChangelogPageClient';
import seoConfig from '../../../data/seo-config.json';
import { Language } from '../../../utils/loadTranslations';

type Params = { params: { locale: Language } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === 'fr' ? 'fr' : 'en';
  const seo = (seoConfig as any)[locale]?.changelog;

  const title = seo?.title ?? (locale === 'fr' ? 'Changelog VMCloud' : 'VMCloud Changelog');
  const description =
    seo?.description ??
    (locale === 'fr'
      ? 'Toutes les mises à jour produit, infrastructure et support, plus notre roadmap détaillée.'
      : 'All product, infrastructure, and support updates plus our detailed roadmap.');

  return {
    title,
    description,
    alternates: {
      canonical: seo?.canonical ?? `/${locale}/changelog`,
      languages: {
        'fr-FR': `https://vmcl.fr/fr/changelog`,
        'en-US': `https://vmcl.fr/en/changelog`,
        'x-default': `https://vmcl.fr/changelog`,
      },
    },
    openGraph: {
      title: seo?.og?.title ?? title,
      description: seo?.og?.description ?? description,
      url: seo?.canonical ?? `https://vmcl.fr/${locale}/changelog`,
      images: seo?.og?.image ? [{ url: seo.og.image, width: 1200, height: 630 }] : undefined,
      type: seo?.og?.type ?? 'website',
    },
    twitter: seo?.twitter
      ? {
          card: seo.twitter.card ?? 'summary_large_image',
          title: seo.twitter.title ?? title,
          description: seo.twitter.description ?? description,
          images: seo.twitter.image ? [seo.twitter.image] : undefined,
        }
      : undefined,
    robots: seo?.robots,
  };
}

export default function ChangelogPage({ params }: Params) {
  const locale = params.locale === 'fr' ? 'fr' : 'en';
  return <ChangelogPageClient locale={locale} />;
}
