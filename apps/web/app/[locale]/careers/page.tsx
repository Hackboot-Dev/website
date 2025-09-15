// /workspaces/website/apps/web/app/[locale]/careers/page.tsx
// Description: Server component for careers page with SEO metadata
// Last modified: 2025-09-13
// Related docs: /docs/JOURNAL.md

import { Metadata } from 'next';
import CareersPageClient from './CareersPageClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = params.locale === 'en';

  return {
    title: isEn
      ? 'Careers at VMCloud - Join Our Team | VMCloud'
      : 'Carrières chez VMCloud - Rejoignez Notre Équipe | VMCloud',
    description: isEn
      ? 'Join VMCloud and shape the future of cloud infrastructure. Remote-first culture, competitive salaries, and exciting challenges await.'
      : 'Rejoignez VMCloud et façonnez l\'avenir de l\'infrastructure cloud. Culture remote-first, salaires compétitifs et défis passionnants.',
    keywords: isEn
      ? 'VMCloud careers, cloud jobs, tech jobs Estonia, remote work, developer jobs, DevOps careers'
      : 'VMCloud carrières, emplois cloud, emplois tech Estonie, travail à distance, emplois développeur, carrières DevOps',
    openGraph: {
      title: isEn
        ? 'Work at VMCloud - Join the Cloud Revolution'
        : 'Travailler chez VMCloud - Rejoignez la Révolution Cloud',
      description: isEn
        ? 'Shape the future of European cloud infrastructure with VMCloud'
        : 'Façonnez l\'avenir de l\'infrastructure cloud européenne avec VMCloud',
      images: ['/og-careers.jpg'],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn ? 'VMCloud Careers' : 'VMCloud Carrières',
      description: isEn
        ? 'Join our passionate team building next-gen cloud infrastructure'
        : 'Rejoignez notre équipe passionnée qui construit l\'infrastructure cloud de demain',
      images: ['/og-careers.jpg']
    },
    alternates: {
      canonical: `https://vmcl.fr/${params.locale}/careers`,
      languages: {
        'en': 'https://vmcl.fr/en/careers',
        'fr': 'https://vmcl.fr/fr/careers'
      }
    }
  };
}

export default function CareersPage() {
  return <CareersPageClient />;
}