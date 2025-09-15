// /workspaces/website/apps/web/app/[locale]/careers/spontaneous/page.tsx
// Description: Server component for spontaneous application page
// Last modified: 2025-09-14
// Related docs: /docs/JOURNAL.md

import { Metadata } from 'next';
import SpontaneousApplicationClient from './SpontaneousApplicationClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = params.locale === 'en';

  return {
    title: isEn
      ? 'Spontaneous Application - Careers | VMCloud'
      : 'Candidature Spontanée - Carrières | VMCloud',
    description: isEn
      ? 'Send us your spontaneous application. We\'re always looking for exceptional talents to join VMCloud.'
      : 'Envoyez-nous votre candidature spontanée. Nous recherchons toujours des talents exceptionnels pour rejoindre VMCloud.',
    keywords: isEn
      ? 'spontaneous application, VMCloud careers, tech jobs, remote work'
      : 'candidature spontanée, VMCloud carrières, emplois tech, travail à distance',
    openGraph: {
      title: isEn
        ? 'Join VMCloud - Spontaneous Application'
        : 'Rejoignez VMCloud - Candidature Spontanée',
      description: isEn
        ? 'We\'re always looking for passionate talents'
        : 'Nous recherchons toujours des talents passionnés',
      images: ['/og-careers.jpg'],
      type: 'website'
    },
    alternates: {
      canonical: `https://vmcl.fr/${params.locale}/careers/spontaneous`,
      languages: {
        'en': 'https://vmcl.fr/en/careers/spontaneous',
        'fr': 'https://vmcl.fr/fr/careers/spontaneous'
      }
    }
  };
}

export default function SpontaneousApplicationPage({ params }: { params: { locale: string } }) {
  return <SpontaneousApplicationClient locale={params.locale} />;
}