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
      ? 'Spontaneous Application – Careers | VMCloud'
      : 'Candidature spontanée – Carrières | VMCloud',
    description: isEn
      ? 'Pitch us your profile and join the team shaping Europe’s sovereign cloud. Remote-friendly roles across SRE, network, product, success and ops.'
      : 'Présentez-nous votre profil et rejoignez l\'équipe qui construit le cloud souverain européen. Postes remote-friendly en SRE, réseau, produit, success et ops.',
    keywords: isEn
      ? 'VMCloud spontaneous application, sovereign cloud jobs, remote tech talent'
      : 'candidature spontanée VMCloud, emplois cloud souverain, talents tech remote',
    openGraph: {
      title: isEn
        ? 'Join VMCloud – Spontaneous Application'
        : 'Rejoignez VMCloud – Candidature spontanée',
      description: isEn
        ? 'Tell us how you want to power the sovereign cloud. We review every application personally.'
        : 'Dites-nous comment vous voulez contribuer au cloud souverain. Chaque candidature est étudiée personnellement.',
      images: [
        {
          url: `/${params.locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isEn
            ? 'Spontaneous application – VMCloud careers'
            : 'Candidature spontanée – Carrières VMCloud',
        },
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn
        ? 'Spontaneous Application | VMCloud Careers'
        : 'Candidature spontanée | Carrières VMCloud',
      description: isEn
        ? 'Send us your story and join VMCloud’s sovereign cloud journey. Remote-first, equity, premium gear.'
        : 'Envoyez-nous votre histoire et rejoignez l\'aventure cloud souverain VMCloud. Remote-first, equity, matériel premium.',
      images: [`/${params.locale}/twitter-image`],
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
