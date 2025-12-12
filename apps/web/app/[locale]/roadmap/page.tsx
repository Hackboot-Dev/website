// apps/web/app/[locale]/roadmap/page.tsx
// Description: Public roadmap page - Server component with metadata
// Last modified: 2025-12-07

import { Metadata } from 'next';
import RoadmapPageClient from './RoadmapPageClient';
import { Language } from '../../../utils/loadTranslations';

type Params = { params: { locale: Language } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = params.locale === 'fr' ? 'fr' : 'en';

  const title = locale === 'fr'
    ? 'Roadmap VMCloud | Phases de développement & vision produit'
    : 'VMCloud Roadmap | Development phases & product vision';

  const description = locale === 'fr'
    ? 'Découvrez notre roadmap publique : phases de développement, fonctionnalités à venir et vision long terme du cloud européen VMCloud.'
    : 'Discover our public roadmap: development phases, upcoming features and long-term vision for VMCloud European cloud.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/roadmap`,
      languages: {
        'fr-FR': `https://vmcl.fr/fr/roadmap`,
        'en-US': `https://vmcl.fr/en/roadmap`,
        'x-default': `https://vmcl.fr/roadmap`,
      },
    },
    openGraph: {
      title: locale === 'fr' ? 'Roadmap VMCloud — Vision & Phases' : 'VMCloud Roadmap — Vision & Phases',
      description,
      url: `https://vmcl.fr/${locale}/roadmap`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: locale === 'fr' ? 'Roadmap VMCloud' : 'VMCloud Roadmap',
      description,
    },
  };
}

export default function RoadmapPage({ params }: Params) {
  const locale = params.locale === 'fr' ? 'fr' : 'en';
  return <RoadmapPageClient locale={locale} />;
}
